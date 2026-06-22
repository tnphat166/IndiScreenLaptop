use serde::Serialize;
use std::sync::Mutex;
use sysinfo::System;

pub struct SystemMonitorState(pub Mutex<System>);

#[derive(Debug, Serialize)]
pub struct SystemStats {
    pub cpu_usage: f32, // Percentage 0-100
    pub memory_used: u64, // Bytes
    pub memory_total: u64, // Bytes
}

#[tauri::command]
pub fn get_system_stats(state: tauri::State<'_, SystemMonitorState>) -> SystemStats {
    let mut sys = state.0.lock().unwrap();
    // Refresh only the parts we need
    sys.refresh_cpu_usage();
    sys.refresh_memory();

    let cpu_usage = sys.global_cpu_info().cpu_usage();
    let memory_used = sys.used_memory();
    let memory_total = sys.total_memory();

    SystemStats {
        cpu_usage,
        memory_used,
        memory_total,
    }
}
