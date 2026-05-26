pub mod mouse;
pub mod hwnd;
pub mod mouse_listener;
pub mod utils;

// 2. 统一重导出（Re-export）
// 这样在 main.rs 中只需要 use crate::core::xxx 即可
pub use hwnd::get_hovered_window_info;
pub use mouse_listener::start_input_listener;
pub use utils::{
    mouse_position, 
    mouse_move_and_click, 
    keyboard_press, 
    keyboard_combo_press,
    copy_to_clipboard
};