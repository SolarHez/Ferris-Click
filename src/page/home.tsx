import WindowControls from "../components/WindowControls";
import { Status } from "../layout/status";
import { Settings } from "../layout/settings";
import { Edit } from "../layout/edit";
import { useKey } from "../hooks/useKey";
import { cn } from "../lib/utils";
import myImage from "../assets/icon.png";

export default function Home() {
  const { state, task, data, action } = useKey();

  return (
    <main className=" w-full h-screen bg-radial-[at_25%_25%] from-primary/15 to-transparent   bg-background text-foreground select-none">
      <div
        data-tauri-drag-region
        className=" w-full flex justify-between p-4 border-b-card border-b border-solid"
      >
        <p className="text-xl font-bold  pointer-events-none flex items-center gap-2">
          <img src={myImage} alt="Logo" className="w-6 h-6" />
          歌词字幕助手
        </p>
        <WindowControls />
      </div>
      <div className=" mx-auto p-4 space-y-3">
        <div className="grid grid-cols-[2fr_1fr] max-sm:grid-cols-1 gap-4">
          <Status state={state} data={data} action={action} />
          <Settings data={data} state={state} task={task} />
        </div>
        <Edit data={data} state={state} action={action} />
      </div>
      <div className="w-full absolute bottom-0 left-0 right-0 xp-4 flex justify-center border-t-card border-t border-solid p-4 pointer-events-none">
        <p className="text-xs text-center text-gray-500/50">
          2026 歌词字幕助手 by{" "}
          <a
            className="text-primary pointer-events-auto underline"
            href="https://github.com/SolarHez"
            target="_blank"
          >
            SolarHez
          </a>
        </p>
        <div className="text-xs text-center text-gray-500 flex items-center gap-2 absolute bottom-4 left-3">
          <span className="relative flex size-1.5">
            {state.isMonitor && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            )}

            <span
              className={cn(
                "relative inline-flex size-1.5 rounded-full ",
                state.isMonitor ? "bg-green-500" : " bg-red-500",
              )}
            ></span>
          </span>
        </div>
      </div>
    </main>
  );
}
