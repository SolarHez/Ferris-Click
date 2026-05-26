mod core;
use crate::core::*;



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
                start_input_listener(app.handle().clone());
                Ok(())
            })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            mouse_position, 
            mouse_move_and_click, 
            keyboard_press, 
            keyboard_combo_press,
            copy_to_clipboard,
            get_hovered_window_info
        ])
        // 监听窗口事件
        .on_window_event(|window, event| match event {
            tauri::WindowEvent::Destroyed => {
                // 如果关闭的是主窗口，则退出应用
                if window.label() == "main" {
                    std::process::exit(0);
                }
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
