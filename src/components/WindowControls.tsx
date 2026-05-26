import { Minus, Square, SunMoon, X } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useSystemTheme } from "@/hooks/useSystemTheme";

export default function WindowControls() {
  // 检查是否不在 Tauri 环境中
  const isTauri =
    typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__;

  if (!isTauri) {
    return null; // 如果是纯网页版，直接不渲染控制按钮
  }

  const appWindow = getCurrentWindow();

  const handleMinimize = async () => {
    await appWindow.minimize();
  };
  const handleToggleMaximize = async () => {
    await appWindow.toggleMaximize();
  };
  const handleClose = async () => {
    await appWindow.close();
  };

  const { handleToggleTheme } = useSystemTheme();

  return (
    <div className="flex items-center gap-5">
      <div
        onClick={() => handleToggleTheme()}
        className="text-foreground/50 hover:text-primary pointer-events-auto"
      >
        <SunMoon size={20} />
      </div>
      <div
        onClick={handleMinimize}
        className="text-foreground/50 hover:text-primary pointer-events-auto"
      >
        <Minus size={20} />
      </div>
      <div
        onClick={handleToggleMaximize}
        className="text-foreground/50 hover:text-primary pointer-events-auto"
      >
        <Square size={16} />
      </div>
      <div
        onClick={handleClose}
        className="text-foreground/50 hover:text-primary pointer-events-auto"
      >
        <X size={20} />
      </div>
    </div>
  );
}
