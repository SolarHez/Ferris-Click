use windows::Win32::Foundation::{HWND, POINT, RECT};
use windows::Win32::UI::WindowsAndMessaging::{
    GetCursorPos, WindowFromPoint, GetClassNameW, GetWindowRect
};

// 获取当前鼠标下窗口的详细信息
// 包括窗口句柄、类名、四个顶点的物理坐标
#[tauri::command]
pub fn get_hovered_window_info() -> Result<serde_json::Value, String> {
    unsafe {
        let mut point = POINT::default();
        
        // 1. 获取当前鼠标坐标
        if GetCursorPos(&mut point).is_err() {
            return Err("无法获取当前鼠标坐标".to_string());
        }

        // 2. 根据坐标探测正下方的窗口句柄 (HWND)
        let hwnd: HWND = WindowFromPoint(point);
        if hwnd.is_invalid() {
            return Err("该坐标下没有合法的窗口句柄".to_string());
        }

        // 3. 获取该窗口的类名
        let mut buffer = [0u16; 256];
        let len = GetClassNameW(hwnd, &mut buffer) as usize;
        let class_name = String::from_utf16_lossy(&buffer[..len]).trim_matches('\0').to_string();

        // 4. 🔥 核心：获取窗口在屏幕上的物理矩形边界 (边界包含 left, top, right, bottom)
        let mut rect = RECT::default();
        if GetWindowRect(hwnd, &mut rect).is_err() {
            return Err("无法获取该窗口的边界坐标".to_string());
        }

        let hwnd_hex = format!("0x{:016X}", hwnd.0 as usize);

        // 5. 组合计算四个顶点的 (X, Y) 物理坐标
        // Windows 的 RECT 定义：
        // left:   左边界 X          top:    上边界 Y
        // right:  右边界 X          bottom: 下边界 Y
        let top_left     = serde_json::json!({ "x": rect.left,  "y": rect.top });    // 左上角
        let top_right    = serde_json::json!({ "x": rect.right, "y": rect.top });    // 右上角
        let bottom_left  = serde_json::json!({ "x": rect.left,  "y": rect.bottom }); // 左下角
        let bottom_right = serde_json::json!({ "x": rect.right, "y": rect.bottom });// 右下角

        Ok(serde_json::json!({
            "hwnd": hwnd_hex,
            "className": class_name,
            "corners": {
                "topLeft": top_left,
                "topRight": top_right,
                "bottomLeft": bottom_left,
                "bottomRight": bottom_right
            },
            "mousePos": serde_json::json!({ "x": point.x, "y": point.y })
        }))
    }
}

