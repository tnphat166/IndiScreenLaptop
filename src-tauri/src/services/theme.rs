use crate::commands::ThemePayload;

/// Registry path and value for Windows theme detection.
const THEME_REG_SUBKEY: &str = r"SOFTWARE\Microsoft\Windows\CurrentVersion\Themes\Personalize";
const THEME_REG_VALUE: &str = "AppsUseLightTheme";

/// Reads the current system theme from the Windows registry.
/// Returns Some("dark") if AppsUseLightTheme == 0, Some("light") if == 1.
/// Returns None if the registry key could not be read.
#[cfg(windows)]
pub fn read_system_theme() -> Option<String> {
    use windows::Win32::System::Registry::*;
    use windows::core::PCWSTR;
    use windows::Win32::Foundation::ERROR_SUCCESS;

    unsafe {
        let mut hkey = HKEY::default();
        let subkey: Vec<u16> = THEME_REG_SUBKEY
            .encode_utf16()
            .chain(std::iter::once(0))
            .collect();

        let status = RegOpenKeyExW(
            HKEY_CURRENT_USER,
            PCWSTR(subkey.as_ptr()),
            0,
            KEY_READ,
            &mut hkey,
        );

        if status != ERROR_SUCCESS {
            return None;
        }

        let value_name: Vec<u16> = THEME_REG_VALUE
            .encode_utf16()
            .chain(std::iter::once(0))
            .collect();

        let mut data: u32 = 1; // default to light
        let mut data_size: u32 = std::mem::size_of::<u32>() as u32;
        let mut reg_type: REG_VALUE_TYPE = REG_DWORD;

        let query_status = RegQueryValueExW(
            hkey,
            PCWSTR(value_name.as_ptr()),
            None,
            Some(&mut reg_type),
            Some(&mut data as *mut u32 as *mut u8),
            Some(&mut data_size),
        );

        let _ = RegCloseKey(hkey);

        if query_status != ERROR_SUCCESS {
            return None;
        }

        if data == 0 {
            Some("dark".to_string())
        } else {
            Some("light".to_string())
        }
    }
}

#[cfg(not(windows))]
pub fn read_system_theme() -> Option<String> {
    Some("light".to_string())
}

/// Starts a background thread that watches for Windows theme changes using
/// `RegNotifyChangeKeyValue`. When a change is detected, it re-reads the
/// registry and emits a `theme-changed` event to the Tauri frontend.
#[cfg(windows)]
pub fn start_theme_watcher<R: tauri::Runtime>(app_handle: tauri::AppHandle<R>) {
    use tauri::Emitter;

    std::thread::spawn(move || {
        use windows::Win32::System::Registry::*;
        use windows::core::PCWSTR;
        use windows::Win32::Foundation::ERROR_SUCCESS;

        let subkey: Vec<u16> = THEME_REG_SUBKEY
            .encode_utf16()
            .chain(std::iter::once(0))
            .collect();

        let mut hkey = HKEY::default();
        unsafe {
            let status = RegOpenKeyExW(
                HKEY_CURRENT_USER,
                PCWSTR(subkey.as_ptr()),
                0,
                KEY_NOTIFY | KEY_READ,
                &mut hkey,
            );

            if status != ERROR_SUCCESS {
                eprintln!("[theme-watcher] Failed to open registry key for watching: {:?}", status);
                return;
            }
        }

        // Track last known theme to avoid duplicate events
        let mut last_theme = read_system_theme().unwrap_or_else(|| "light".to_string());

        loop {
            // Block until a registry value changes
            let notify_result = unsafe {
                RegNotifyChangeKeyValue(
                    hkey,
                    false, // don't watch subtree
                    REG_NOTIFY_CHANGE_LAST_SET, // watch value changes
                    None,  // no event handle — blocks synchronously
                    false, // synchronous
                )
            };

            if notify_result != ERROR_SUCCESS {
                eprintln!("[theme-watcher] RegNotifyChangeKeyValue failed: {:?}", notify_result);
                // Small delay before retrying to avoid tight loop on persistent errors
                std::thread::sleep(std::time::Duration::from_secs(5));
                continue;
            }

            // Re-read the theme after the notification
            if let Some(current_theme) = read_system_theme() {
                if current_theme != last_theme {
                    last_theme = current_theme.clone();
                    let payload = ThemePayload {
                        theme: current_theme,
                    };
                    if let Err(e) = app_handle.emit("theme-changed", payload) {
                        eprintln!("[theme-watcher] Failed to emit theme-changed event: {}", e);
                    }
                }
            }
        }

        // Note: In practice this loop runs for the lifetime of the app.
        // The thread is cleaned up when the process exits.
        // If we ever break out, close the key:
        #[allow(unreachable_code)]
        unsafe {
            let _ = RegCloseKey(hkey);
        }
    });
}

/// No-op on non-Windows platforms.
#[cfg(not(windows))]
pub fn start_theme_watcher<R: tauri::Runtime>(_app_handle: tauri::AppHandle<R>) {
    // Theme watching is only supported on Windows.
}
