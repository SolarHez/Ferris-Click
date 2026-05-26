use std::thread;
use std::time::Duration;
use windows::Win32::UI::WindowsAndMessaging::SetCursorPos;
use windows::Win32::UI::Input::KeyboardAndMouse::{
    SendInput, INPUT, INPUT_0, MOUSEINPUT, INPUT_MOUSE, 
    MOUSEEVENTF_LEFTDOWN, MOUSEEVENTF_LEFTUP, 
    MOUSEEVENTF_RIGHTDOWN, MOUSEEVENTF_RIGHTUP, 
    MOUSE_EVENT_FLAGS
};

/// 封装一个原生的发送鼠标事件的辅助函数
fn send_mouse_input(flags: MOUSE_EVENT_FLAGS) {
    unsafe {
        let input = INPUT {
            r#type: INPUT_MOUSE,
            Anonymous: INPUT_0 {
                mi: MOUSEINPUT {
                    dx: 0,
                    dy: 0,
                    mouseData: 0,
                    dwFlags: flags,
                    time: 0,
                    dwExtraInfo: 0,
                },
            },
        };
        // 发送给 Windows 核心输入流
        SendInput(&[input], std::mem::size_of::<INPUT>() as i32);
    }
}

#[tauri::command]
pub fn move_and_click(x: f64, y: f64, click: Option<String>) {
    // 1. 原生绝对物理坐标移动：永不乱飞
    unsafe {
        let _ = SetCursorPos(x as i32, y as i32);
    }

    // 给系统和光标 50 毫秒的物理同步时间
    thread::sleep(Duration::from_millis(50));

    // 2. 原生鼠标点击
    if let Some(click_type) = click {
        match click_type.as_str() {
            "left" => {
                println!("🖱️ Win32 原生左键点击");
                send_mouse_input(MOUSEEVENTF_LEFTDOWN); // 按下
                thread::sleep(Duration::from_millis(40));
                send_mouse_input(MOUSEEVENTF_LEFTUP);   // 松开
            }
            "right" => {
                println!("🖱️ Win32 原生右键点击");
                send_mouse_input(MOUSEEVENTF_RIGHTDOWN); // 按下
                thread::sleep(Duration::from_millis(40));
                send_mouse_input(MOUSEEVENTF_RIGHTUP);   // 松开
            }
            _ => {}
        }
    }
}
