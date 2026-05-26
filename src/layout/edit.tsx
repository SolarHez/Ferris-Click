import { openUrl } from "@tauri-apps/plugin-opener";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Field, FieldLabel } from "../components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "../components/ui/input-group";
import { Switch } from "../components/ui/switch";
import { useEffect, useState } from "react";
import { KeyAction, KeyData, KeyState } from "../type";
import { Save, TextInitial, Trash2 } from "lucide-react";

export const Edit = ({
  data,
  state,
  action,
}: {
  data: KeyData;
  state: KeyState;
  action: KeyAction;
}) => {
  const [singer, setSinger] = useState("");
  const [decoratorStart, setDecoratorStart] = useState("😊");
  const [decoratorEnd, setDecoratorEnd] = useState("🌈");
  const [text, setText] = useState("");

  const [isNewText, setIsNewText] = useState(false);
  useEffect(() => {
    const newText = text.trim();
    const oldText = data?.textArray?.join("\n");
    setIsNewText(newText !== oldText);
  }, [text, data?.textArray]);

  useEffect(() => {
    action.setSinger?.(singer);
  }, [singer]);

  useEffect(() => {
    const style = [decoratorStart, decoratorEnd];
    action.setStyle?.(style);
  }, [decoratorStart, decoratorEnd]);

  if (!data) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <TextInitial />
          歌词
        </CardTitle>
        <CardDescription>配置歌词内容以及样式</CardDescription>
      </CardHeader>
      <CardContent>
        <div className=" space-y-3">
          <Field orientation="horizontal" className="">
            <FieldLabel>演唱者信息</FieldLabel>
            <InputGroup className="max-w-42">
              <InputGroupInput
                value={singer}
                onChange={(e) => setSinger(e.target.value)}
                placeholder="演唱者信息"
              />
            </InputGroup>
          </Field>
          <Field orientation="horizontal">
            <FieldLabel>歌词样式装饰</FieldLabel>
            <InputGroup className="max-w-42">
              <InputGroupInput
                value={decoratorStart}
                onChange={(e) => setDecoratorStart(e.target.value)}
                placeholder={decoratorStart}
              />
              <InputGroupAddon align="inline-start">
                <InputGroupText>开头：</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <InputGroup className="max-w-42">
              <InputGroupInput
                value={decoratorEnd}
                onChange={(e) => setDecoratorEnd(e.target.value)}
                placeholder={decoratorEnd}
              />
              <InputGroupAddon align="inline-start">
                <InputGroupText>结尾：</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field orientation="horizontal" className=" space-x-12">
            <div className=" flex items-center gap-2">
              <FieldLabel>双行模式</FieldLabel>
              <Switch
                checked={state?.mode === "two"}
                onCheckedChange={action?.toggleMode}
              />
            </div>
            <div className=" flex items-center gap-2">
              <FieldLabel>显示演唱者</FieldLabel>
              <Switch
                checked={state?.isShowSinger}
                onCheckedChange={action?.setIsShowSinger}
              />
            </div>
            <div className=" flex items-center gap-2">
              <FieldLabel>显示样式装饰</FieldLabel>
              <Switch
                checked={state?.isShowStyle}
                onCheckedChange={action?.setIsShowStyle}
              />
            </div>
          </Field>
          <Field>
            <div className=" flex justify-between items-center gap-2">
              <p>歌词内容</p>
              <Button
                variant="link"
                size="sm"
                className=" cursor-pointer flex"
                onClick={() => {
                  openUrl("https://www.kugeci.com/");
                }}
              >
                获取
              </Button>
            </div>
            <InputGroup className="max-w-full max-h-42">
              <InputGroupTextarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="请输入歌词内容"
              />
              <InputGroupAddon
                align="block-end"
                className=" flex items-center gap-2 justify-between"
              >
                <p className="text-xs">
                  字数：{[...text.trim().replace(/[\r\n]/g, "")].length}
                </p>
                <div className=" flex items-center gap-2">
                  {text.trim() && (
                    <InputGroupButton
                      key="clear"
                      variant="outline"
                      disabled={!text}
                      size="sm"
                      className="ml-auto hover:text-white! hover:bg-red-800! cursor-pointer tracking-all duration-300"
                      onClick={() => {
                        setText("");
                        action?.setCurrentIndex?.(0);
                        action?.setTextArray?.([]);
                      }}
                    >
                      <Trash2 />
                      清空
                    </InputGroupButton>
                  )}
                  <InputGroupButton
                    key="save"
                    disabled={!text.trim() || !isNewText}
                    onClick={() => {
                      action?.setCurrentIndex?.(0);
                      action?.setTextArray?.(text.trim().split("\n"));
                    }}
                    variant={isNewText ? "default" : "outline"}
                    size="sm"
                    className=" hover:text-white! cursor-pointer tracking-all duration-300"
                  >
                    <Save />
                    保存
                  </InputGroupButton>
                </div>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>
      </CardContent>
    </Card>
  );
};
