use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ThemePayload {
    pub theme: String,
}

/// Reads the Windows registry to determine the current system theme.
/// Returns "dark" if AppsUseLightTheme == 0, "light" if == 1, defaults to "light".
#[tauri::command]
pub fn get_system_theme() -> String {
    #[cfg(windows)]
    {
        crate::services::theme::read_system_theme().unwrap_or_else(|| "light".to_string())
    }
    #[cfg(not(windows))]
    {
        "light".to_string()
    }
}

/// Toggles click-through mode on the given window.
///
/// When `enabled` is true, the window gets WS_EX_TRANSPARENT | WS_EX_LAYERED
/// so mouse clicks pass through to whatever is behind. When false, those flags
/// are removed so the window captures clicks normally.
#[tauri::command]
pub fn set_click_through(
    label: String,
    enabled: bool,
    window: tauri::Window,
) -> Result<(), String> {
    #[cfg(windows)]
    {
        use windows::Win32::Foundation::HWND;
        use windows::Win32::UI::WindowsAndMessaging::{
            GetWindowLongPtrW, SetWindowLongPtrW, GWL_EXSTYLE, WS_EX_LAYERED, WS_EX_TRANSPARENT,
        };

        let raw_hwnd = window
            .hwnd()
            .map_err(|e| format!("Failed to get HWND for '{}': {}", label, e))?;
        let hwnd = HWND(raw_hwnd.0);

        unsafe {
            let current_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
            let transparent_flags = (WS_EX_TRANSPARENT.0 | WS_EX_LAYERED.0) as isize;

            let new_style = if enabled {
                current_style | transparent_flags
            } else {
                current_style & !transparent_flags
            };

            SetWindowLongPtrW(hwnd, GWL_EXSTYLE, new_style);
        }

        log::info!(
            "Click-through {} for window '{}'",
            if enabled { "enabled" } else { "disabled" },
            label
        );
        Ok(())
    }

    #[cfg(not(windows))]
    {
        let _ = (label, enabled, window);
        Err("set_click_through is only supported on Windows".to_string())
    }
}
