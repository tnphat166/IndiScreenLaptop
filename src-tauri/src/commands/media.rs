use serde::Serialize;
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Serialize, Clone)]
pub struct MediaInfo {
    pub title: String,
    pub artist: String,
    pub album_art_url: Option<String>,
    pub is_playing: bool,
    pub last_updated: u64,
}

pub struct MediaState(pub Mutex<MediaInfo>);

#[tauri::command]
pub fn get_current_media_info(state: tauri::State<'_, MediaState>) -> MediaInfo {
    state.0.lock().unwrap().clone()
}

#[tauri::command]
pub fn media_play_pause() -> Result<(), String> {
    #[cfg(windows)]
    {
        use windows::Win32::UI::Input::KeyboardAndMouse::{keybd_event, VK_MEDIA_PLAY_PAUSE, KEYEVENTF_KEYUP};
        unsafe {
            keybd_event(VK_MEDIA_PLAY_PAUSE.0 as u8, 0, Default::default(), 0);
            keybd_event(VK_MEDIA_PLAY_PAUSE.0 as u8, 0, KEYEVENTF_KEYUP, 0);
        }
        Ok(())
    }
    #[cfg(not(windows))]
    {
        Err("Not supported".into())
    }
}

#[tauri::command]
pub fn media_next() -> Result<(), String> {
    #[cfg(windows)]
    {
        use windows::Win32::UI::Input::KeyboardAndMouse::{keybd_event, VK_MEDIA_NEXT_TRACK, KEYEVENTF_KEYUP};
        unsafe {
            keybd_event(VK_MEDIA_NEXT_TRACK.0 as u8, 0, Default::default(), 0);
            keybd_event(VK_MEDIA_NEXT_TRACK.0 as u8, 0, KEYEVENTF_KEYUP, 0);
        }
        Ok(())
    }
    #[cfg(not(windows))]
    {
        Err("Not supported".into())
    }
}

#[tauri::command]
pub fn media_prev() -> Result<(), String> {
    #[cfg(windows)]
    {
        use windows::Win32::UI::Input::KeyboardAndMouse::{keybd_event, VK_MEDIA_PREV_TRACK, KEYEVENTF_KEYUP};
        unsafe {
            keybd_event(VK_MEDIA_PREV_TRACK.0 as u8, 0, Default::default(), 0);
            keybd_event(VK_MEDIA_PREV_TRACK.0 as u8, 0, KEYEVENTF_KEYUP, 0);
        }
        Ok(())
    }
    #[cfg(not(windows))]
    {
        Err("Not supported".into())
    }
}
