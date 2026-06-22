pub mod commands;
pub mod services;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::get_system_theme,
            commands::set_click_through,
        ])
        .setup(|app| {
            // Start the theme watcher background thread
            let app_handle = app.handle().clone();
            services::theme::start_theme_watcher(app_handle);

            // Apply initial overlay window styles on Windows
            #[cfg(windows)]
            {
                if let Some(window) = app.get_webview_window("main") {
                    apply_overlay_styles(&window);
                } else {
                    eprintln!("[setup] Warning: could not find 'main' window to apply overlay styles");
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/// Applies initial extended window styles for overlay mode on Windows.
/// Sets WS_EX_LAYERED so the window can be made transparent/click-through later.
/// Does NOT set WS_EX_TRANSPARENT here — clicks should be captured by default.
#[cfg(windows)]
fn apply_overlay_styles(window: &tauri::WebviewWindow) {
    use windows::Win32::Foundation::HWND;
    use windows::Win32::UI::WindowsAndMessaging::{
        GetWindowLongPtrW, SetWindowLongPtrW, GWL_EXSTYLE, WS_EX_LAYERED,
    };

    match window.hwnd() {
        Ok(raw_hwnd) => {
            let hwnd = HWND(raw_hwnd.0);
            unsafe {
                let current_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
                let new_style = current_style | WS_EX_LAYERED.0 as isize;
                SetWindowLongPtrW(hwnd, GWL_EXSTYLE, new_style);
            }
            log::info!("[setup] Applied WS_EX_LAYERED to main window");
        }
        Err(e) => {
            eprintln!("[setup] Failed to get HWND for overlay styles: {}", e);
        }
    }
}
