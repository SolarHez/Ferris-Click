use rustautogui::{RustAutoGui};
use once_cell::sync::Lazy;
use std::thread;
use std::time::Duration;
use crate::core::mouse::move_and_click;

static GUI: Lazy<RustAutoGui> = Lazy::new(|| {
    RustAutoGui::new(false).expect("无法初始化 RustAutoGui，请确保拥有管理员权限")
});

// 获取鼠标位置
#[tauri::command]
pub fn mouse_position() ->(i32, i32){
    GUI.get_mouse_position().unwrap_or((0, 0))
}

// 模拟鼠标移动和点击
#[tauri::command]
pub fn mouse_move_and_click(x: f64, y: f64, click: Option<String>) {
    // 移动鼠标 (0.0 表示瞬间移动)
    move_and_click(x, y, click);
}

// 模拟按键
#[tauri::command]
pub fn keyboard_press(key: &str) -> Result<(), String> {
    // 尝试执行，如果失败，将错误转换为 String 返回给前端
    GUI.keyboard_command(key).map_err(|e| format!("按键操作失败: {}", e))
}

/// 模拟按键组合
#[tauri::command]
pub fn keyboard_combo_press(keys: Vec<String>) {
    if keys.is_empty() { return; }

    // 1. 按下所有键
    for key in &keys {
        GUI.key_down(key).unwrap();
    }
    
    // 2. 模拟物理按键时长
    thread::sleep(Duration::from_millis(50));
    
    // 3. 按照“相反的顺序”释放按键 (这是标准的组合键释放习惯)
    for key in keys.iter().rev() {
        GUI.key_up(key).unwrap();
    }
}


use arboard::Clipboard;

#[tauri::command]
pub fn copy_to_clipboard(text: String) -> Result<(), String> {
    let mut clipboard = Clipboard::new().map_err(|e| e.to_string())?;
    clipboard.set_text(text).map_err(|e| e.to_string())?;
    Ok(())
}