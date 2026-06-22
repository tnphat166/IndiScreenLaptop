use serde::Serialize;
use std::process::Command;
#[cfg(windows)]
use windows_icons::get_icon_base64_by_path;

#[derive(Debug, Serialize)]
pub struct RunningApp {
    pub title: String,
    pub path: String, // Process path if possible, or just hwnd identifier
    pub hwnd: isize,
}

#[tauri::command]
pub fn launch_shortcut(path: String) -> Result<(), String> {
    #[cfg(windows)]
    {
        Command::new("explorer")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("Failed to launch shortcut: {}", e))?;
        Ok(())
    }
    #[cfg(not(windows))]
    {
        Err("launch_shortcut is only supported on Windows".to_string())
    }
}

#[tauri::command]
pub fn extract_icon(path: String) -> Result<String, String> {
    #[cfg(windows)]
    {
        let b64 = get_icon_base64_by_path(&path)
            .map_err(|e| format!("Failed to extract icon: {}", e))?;
        Ok(format!("data:image/png;base64,{}", b64))
    }
    #[cfg(not(windows))]
    {
        Err("extract_icon is only supported on Windows".to_string())
    }
}

#[tauri::command]
pub fn get_running_apps() -> Result<Vec<RunningApp>, String> {
    #[cfg(windows)]
    {
        use windows::Win32::Foundation::{BOOL, HWND, LPARAM};
        use windows::Win32::UI::WindowsAndMessaging::{
            EnumWindows, GetWindowTextLengthW, GetWindowTextW, IsWindowVisible, WS_EX_TOOLWINDOW, GetWindowLongPtrW, GWL_EXSTYLE
        };
        use std::ffi::OsString;
        use std::os::windows::ffi::OsStringExt;

        let mut apps: Vec<RunningApp> = Vec::new();

        unsafe extern "system" fn enum_window(hwnd: HWND, lparam: LPARAM) -> BOOL {
            let apps = &mut *(lparam.0 as *mut Vec<RunningApp>);
            
            // Only visible windows
            if IsWindowVisible(hwnd).as_bool() {
                // Ignore tool windows
                let exstyle = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
                if (exstyle & WS_EX_TOOLWINDOW.0 as isize) == 0 {
                    let length = GetWindowTextLengthW(hwnd);
                    if length > 0 {
                        let mut buffer: Vec<u16> = vec![0; (length + 1) as usize];
                        GetWindowTextW(hwnd, &mut buffer);
                        if let Some(null_idx) = buffer.iter().position(|&c| c == 0) {
                            buffer.truncate(null_idx);
                        }
                        let title = OsString::from_wide(&buffer).to_string_lossy().into_owned();
                        
                        // We filter out some common background process titles if needed.
                        if title != "Program Manager" && title != "Settings" {
                            apps.push(RunningApp {
                                title,
                                path: "".to_string(), // For simplicity, we just use title and hwnd
                                hwnd: hwnd.0 as isize,
                            });
                        }
                    }
                }
            }
            BOOL(1)
        }

        unsafe {
            let lparam = LPARAM(&mut apps as *mut _ as isize);
            let _ = EnumWindows(Some(enum_window), lparam);
        }

        Ok(apps)
    }
    #[cfg(not(windows))]
    {
        Ok(vec![])
    }
}
