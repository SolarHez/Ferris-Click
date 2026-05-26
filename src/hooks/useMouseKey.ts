import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export const useMouseKey = () => {
  const [mousePosition, setMousePosition] = useState<number[]>([]);

  // 获取鼠标当前位置
  async function getMousePosition() {
    const pos = await invoke<number[]>("mouse_position");
    setMousePosition(pos);
    console.log(pos);
    return pos;
  }

  // 移动鼠标到指定位置并点击
  async function moveMouseTo(
    x: number,
    y: number,
    click?: "left" | "right" | "middle",
  ) {
    await invoke("mouse_move_and_click", { x, y, click });
  }

  // 模拟按键
  async function keyboardPress(key: string) {
    await invoke("keyboard_press", { key });
  }

  // 模拟按键组合
  async function keyboardComboPress(keys: string[]) {
    await invoke("keyboard_combo_press", { keys });
  }

  return {
    mousePosition,
    getMousePosition,
    moveMouseTo,
    keyboardPress,
    keyboardComboPress,
  };
};
