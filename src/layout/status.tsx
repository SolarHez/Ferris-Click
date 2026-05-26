import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Field, FieldLabel } from "../components/ui/field";
import { KeyAction, KeyData, KeyState } from "../type";
import { Activity } from "lucide-react";

export const Status = ({
  state,
  data,
  action,
}: {
  state: KeyState;
  data: KeyData;
  action: KeyAction;
}) => {
  const [remainCount, setRemainCount] = useState(0); // 剩余歌词数
  useEffect(() => {
    if (!data) return;
    const length = data?.textArray?.length;
    const currentIndex = data?.currentIndex;
    const count = length! - currentIndex!;
    setRemainCount(count);
  }, [data?.currentIndex, data?.textArray]);

  const [previewContent, setPreviewContent] = useState(""); // 预览内容
  useEffect(() => {
    if (!data) return;
    const currentIndex = data?.currentIndex;
    if (data?.textArray?.length === 0) return setPreviewContent("");
    let content =
      state?.mode === "one"
        ? data?.textArray?.[currentIndex!] || ""
        : data?.textArray?.[currentIndex!] +
            "\n" +
            data?.textArray?.[currentIndex! + 1] || "";

    if (content.includes("undefined")) return;

    if (state?.isShowStyle) {
      if (data.style) content = addStyle(content, data?.style);
    }
    if (state?.isShowSinger) {
      if (data.singer) content = addSinger(content, data?.singer);
    }

    setPreviewContent(content);
    action.setSendText?.(content);
  }, [
    data?.currentIndex,
    data?.textArray,
    state?.mode,
    state?.isShowSinger,
    state?.isShowStyle,
    data?.style,
    data?.singer,
  ]);

  if (!data || !state) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Activity />
          状态:
          {state?.isMonitor ? (
            <p className="text-green-500 text-xl font-bold">监听中</p>
          ) : (
            <p className="text-red-500 text-xl font-bold">等待监听</p>
          )}
        </CardTitle>
        <CardDescription>数据监听状态以及内容预览</CardDescription>
      </CardHeader>
      <CardContent>
        <div className=" space-y-3">
          <Field orientation="horizontal" className="">
            <FieldLabel>
              总歌词数:
              <p className="text-xl font-bold">
                {data?.textArray?.length || 0}
              </p>
            </FieldLabel>

            <FieldLabel>
              剩余歌词数:
              <p className="text-xl font-bold">{remainCount}</p>
            </FieldLabel>

            <FieldLabel>
              歌词显示模式:
              <p className="text-xl font-bold">
                {state?.mode === "one" ? "单行模式" : "双行模式"}
              </p>
            </FieldLabel>
          </Field>
          <Field className="">
            <FieldLabel>发送内容预览</FieldLabel>
            <div className=" bg-black/50 rounded-md flex items-center justify-center min-h-28 p-5 select-text">
              <h1 className="text-lg font-bold whitespace-pre w-full">
                {previewContent}
              </h1>
            </div>
          </Field>
        </div>
      </CardContent>
    </Card>
  );
};

function addSinger(text: string, signature: string) {
  const textLines = text.split("\n");
  const sigWidth = [...textLines[0]].length;
  // 核心：使用全角空格 ( ) 填充，它的宽度约为 2，非常适合平衡对齐
  const padding = "\u3000".repeat(sigWidth);
  return `${text}\n${padding}${signature}`;
}

function addStyle(text: string, style: string[]) {
  const textLines = text.split("\n");
  const sigWidth = [...style[0]].length;
  const padding = "\u3000".repeat(sigWidth);
  if (textLines[1] === undefined) {
    return `${style[0]}${textLines[0]}${style[1]}`;
  }

  return `${style[0]}${textLines[0]}\n${padding}${textLines[1] || ""}${style[1]}`;
}
