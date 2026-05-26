import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";

interface InputEvent {
  event_type: "mouse_down" | "key_press" | "mouse_move";
  data: string;
}

// 这是一个全局的事件中心
const listeners = new Map<string, (data: any) => void>();

// 启动一次监听（只需在顶层调用一次）
export function initGlobalInputListener() {
  listen<any>("global-input", (event) => {
    const { data } = event.payload as InputEvent;
    // data 假设就是按键名称，比如 "F8"
    if (listeners.has(data)) {
      listeners.get(data)?.(event.payload);
    }
  });
}

// 这是你想要的“添加监听”模式
export function useGlobalHotkey() {
  const addListener = (key: string, callback: (data: any) => void) => {
    listeners.set(key, callback);
  };

  const removeListener = (key: string) => {
    listeners.delete(key);
  };

  useEffect(() => {
    initGlobalInputListener();
  }, []);

  return {
    addListener,
    removeListener,
  };
}
