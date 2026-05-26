import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import {
  availableMonitors,
  LogicalPosition,
  LogicalSize,
} from "@tauri-apps/api/window";
import { useRef } from "react";
import { emit } from "@tauri-apps/api/event";

export const useFullWind = () => {
  var webview = useRef<WebviewWindow | null>(null);

  const createWindow = async () => {
    console.log("正在准备创建子窗口...");
    const label = `capture-window`;

    webview.current = new WebviewWindow(label, {
      url: "/index.html#/capture",
      title: "坐标捕获",
      width: 800,
      height: 600,
      center: true, // 窗口居中
      decorations: false, // 显示窗口边框
      resizable: false, // 窗口大小调整
      transparent: true,
      shadow: false,
      skipTaskbar: true, // 不在任务栏显示
      alwaysOnTop: true, // 窗口总在顶部
      fullscreen: false, // 全屏模式
      maximized: true, // 最大化
      focus: true, // 窗口获得焦点
      backgroundColor: "#00000000", // 窗口背景颜色
    });

    // 在窗口创建成功的回调里调用
    webview.current.once("tauri://created", async () => {
      if (!webview.current) return;
      await webview.current.setSize(new LogicalSize(10000, 10000));
      // 1. 获取屏幕信息
      const monitors = await availableMonitors();
      const sorted = [...monitors].sort((a, b) => a.position.x - b.position.x);
      if (monitors.length > 0 && webview.current) {
        let width = 0;
        let height = 0;
        for (let i = 0; i < monitors.length; i++) {
          width += monitors[i].size.width / monitors[i].scaleFactor;
          height = monitors[i].size.height / monitors[i].scaleFactor;
        }
        // 2. 将窗口大小强制设定为显示器分辨率大小
        await webview.current.setSize(new LogicalSize(width, height));
        // 3. 将位置设定为左上角
        await webview.current.setPosition(
          new LogicalPosition(sorted[0].position.x / sorted[0].scaleFactor, 0),
        );
      }
      //   await enablePass();
    });
  };

  // 在页面里加两个按钮测试
  // 设置穿透
  const enablePass = async () => {
    if (!webview.current) return;
    await webview.current.setIgnoreCursorEvents(true);
    console.log("穿透已开启");
  };

  // 取消穿透
  const disablePass = async () => {
    if (!webview.current) return;
    await webview.current.setIgnoreCursorEvents(false);
    console.log("穿透已关闭");
  };

  // 关闭窗口
  const closeWindow = async () => {
    if (!webview.current) return;
    await webview.current.setPosition(new LogicalPosition(-10000, -10000));
    await webview.current.close();
  };

  // 发送消息到窗口
  const sendMessage = async (message: any) => {
    if (!webview.current) return;
    await emit("event-name", message);
    console.log("发送消息:", message);
  };

  return { createWindow, enablePass, disablePass, closeWindow, sendMessage };
};
