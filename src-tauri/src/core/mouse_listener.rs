use device_query::{DeviceQuery, DeviceState, Keycode};
use tauri::{AppHandle, Emitter};
use serde::Serialize;
use std::thread;
use std::time::Duration;

#[derive(Serialize, Clone)]
struct EventPayload {
    event_type: String,
    data: String,
}

pub fn start_input_listener(app_handle: AppHandle) {
    thread::spawn(move || {
        let device_state = DeviceState::new();
        
        let mut last_keys: Vec<Keycode> = Vec::new();
        // 修改类型为 Vec<bool>
        let mut last_buttons: Vec<bool> =  Vec::new();// 假设最多有8个鼠标键位
        // let mut last_mouse_pos = (0, 0);

        loop {
            // --- 键盘检测 ---
            let current_keys = device_state.get_keys();
            for key in &current_keys {
                if !last_keys.contains(key) {
                    let _ = app_handle.emit("global-input", EventPayload {
                        event_type: "key_press".into(),
                        data: format!("{:?}", key),
                    });
                }
            }
            last_keys = current_keys;

            // --- 鼠标点击检测 ---
            let mouse = device_state.get_mouse();
            let current_buttons = mouse.button_pressed; // 这是 Vec<bool>

            // 检查是否有按下的状态从 false 变为 true
            for i in 0..current_buttons.len() {
                if current_buttons[i] && (i >= last_buttons.len() || !last_buttons[i]) {
                    let _ = app_handle.emit("global-input", EventPayload {
                        event_type: "mouse_down".into(),
                        data: format!("button_{}", i + 1), // 这里的 i 对应鼠标按键索引
                    });
                }
            }
            last_buttons = current_buttons;

            // --- 鼠标移动检测 ---
            // if mouse.coords != last_mouse_pos {
            //     last_mouse_pos = mouse.coords;
            //     let _ = app_handle.emit("global-input", EventPayload {
            //         event_type: "mouse_move".into(),
            //         data: format!("{},{}", mouse.coords.0, mouse.coords.1),
            //     });
            // }

            thread::sleep(Duration::from_millis(20));
        }
    });
}