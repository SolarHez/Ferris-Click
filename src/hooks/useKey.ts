import { toast } from "sonner";
import { useGlobalHotkey } from "./useGlobalInput";
import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useMouseKey } from "./useMouseKey";
import { useFullWind } from "./useFullWind";

interface LatestData {
  xy: string;
  mode: string;
  textArray: string[];
  currentIndex: number;
  sendText: string;
}
// 自定义 Hook：自动同步多个状态到 Ref
function useLatestStates(states: LatestData) {
  const ref = useRef(states);

  // 每次渲染后，将最新的 states 更新到 ref.current
  useEffect(() => {
    ref.current = states;
  }, [states]); // 只要 states 数组中的任何一个值变化，就会同步

  return ref;
}

export const useKey = () => {
  const { addListener, removeListener } = useGlobalHotkey();
  const { getMousePosition, moveMouseTo, keyboardComboPress } = useMouseKey();
  const { createWindow, closeWindow } = useFullWind();

  const [isMonitor, setMonitor] = useState(false);
  const [xy, setXy] = useState<string>("");
  const [mode, setMode] = useState("one");
  const [isShowSinger, setIsShowSinger] = useState(false);
  const [isShowStyle, setIsShowStyle] = useState(false);
  const [style, setStyle] = useState<string[]>(["😍", "💕"]);
  const [singer, setSinger] = useState<string>("");

  const [sendText, setSendText] = useState<string>("");
  const [textArray, setTextArray] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGetMouseXY, setGetMouseXY] = useState(false);

  // 最新数据引用
  const latestDataRef = useLatestStates({
    xy,
    mode,
    textArray,
    currentIndex,
    sendText,
  });

  // 开始监听
  const startMonitor = () => {
    toast.success("开始监听", {
      className: "!text-green-500 !font-bold !bg-card/50",
      position: "top-center",
    });
    addListener("F8", sendKey); // 发送按键
    addListener("F9", skipKey); // 跳过按键
    setMonitor(true);
  };

  // 关闭监听
  const stopMonitor = () => {
    toast("监听已关闭", {
      className: "!text-green-500 !font-bold !bg-card/50",
      position: "top-center",
    });
    removeListener("F8");
    removeListener("F9");
    setMonitor(false);
  };

  // 切换监听状态
  const toggleMonitor = () => {
    if (isMonitor) {
      stopMonitor();
    } else {
      startMonitor();
    }
  };

  // 捕获鼠标位置
  const captureMouseXY = async () => {
    document.documentElement.classList.add("crosshair-mode");
    setGetMouseXY(true);
    await createWindow();
    toast.info("请点击鼠标键设置坐标位置", {
      className: "text-yellow-500! !bg-card/50",
      position: "top-center",
    });
    // 清除监听
    const clear = async () => {
      removeListener("button_2");
      removeListener("Escape");
      setGetMouseXY(false);
      await closeWindow();
      document.documentElement.classList.remove("crosshair-mode");
    };

    // 点击鼠标键捕获位置
    addListener("button_2", async (_: any) => {
      const position = await getMousePosition();
      setXy(`${position[0]},${position[1]}`);
      toast.success(`坐标位置设置成功`, {
        className: "text-green-500! !bg-card/50",
        position: "top-center",
      });
      await clear();
    });

    // 按下Escape键中断捕获位置
    addListener("Escape", async (_: any) => {
      toast.info(`中断了位置捕获`, {
        className: "text-yellow-500! !bg-card/50",
        position: "top-center",
      });
      await clear();
    });
  };

  // 发送按键
  const send = async (text: string, x: number, y: number) => {
    await invoke("copy_to_clipboard", {
      text,
    }); // 复制文本到剪贴板
    const position = await getMousePosition(); // 记录当前位置
    await moveMouseTo(x, y, "left"); // 移动鼠标到指定位置并点击
    await keyboardComboPress(["ctrl", "v"]); // 模拟粘贴
    await keyboardComboPress(["enter"]); // 模拟Enter键
    await moveMouseTo(position[0], position[1]); // 移动鼠标回原来的位置
  };

  // 安全检测提示
  const safeCheck = () => {
    const { xy, textArray, currentIndex, sendText } = latestDataRef.current;
    if (!xy) {
      toast("请先设置输入框坐标位置", {
        className: "text-yellow-500! !bg-card/50",
        position: "top-center",
      });
      return false;
    }

    if (textArray.length === 0) {
      toast("请先添加歌词", {
        className: "text-yellow-500! !bg-card/50",
        position: "top-center",
      });
      return false;
    }

    if (currentIndex >= textArray.length) {
      toast("没有更多待发送的歌词", {
        className: "text-yellow-500! !bg-card/50",
        position: "top-center",
      });
      return false;
    }

    if (!sendText) {
      return false;
    }

    return true;
  };

  // 切换模式  one: 单语模式  two: 双语模式
  const toggleMode = () => {
    setMode(mode === "one" ? "two" : "one");
    toast.success(`切换到${mode !== "one" ? "单行模式" : "双行模式"}`, {
      className: "text-green-500! !bg-card/50",
      position: "top-center",
    });
  };

  // 发送按键
  const sendKey = () => {
    const { xy, mode, sendText } = latestDataRef.current;
    if (!safeCheck()) return;
    var x = Number(xy.split(",")[0]);
    var y = Number(xy.split(",")[1]);
    send(sendText, x, y);
    setCurrentIndex((prevIndex) => prevIndex + (mode === "one" ? 1 : 2));
  };

  // 跳过按键
  const skipKey = () => {
    const { mode, sendText } = latestDataRef.current;
    if (!safeCheck()) return;
    toast(`跳过歌词`, {
      className: "text-green-500! !bg-card/50",
      position: "top-center",
      description: sendText,
    });
    setCurrentIndex((prevIndex) => prevIndex + (mode === "one" ? 1 : 2));
  };

  return {
    task: { startMonitor, stopMonitor, toggleMonitor, captureMouseXY },
    state: { isMonitor, mode, isGetMouseXY, isShowSinger, isShowStyle },
    action: {
      toggleMode,
      setTextArray,
      setCurrentIndex,
      setXy,
      setMode,
      setIsShowSinger,
      setIsShowStyle,
      setStyle,
      setSinger,
      setSendText,
    },
    data: { textArray, currentIndex, xy, mode, style, singer, sendText },
  };
};
