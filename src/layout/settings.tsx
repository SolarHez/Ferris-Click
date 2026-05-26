import { Keyboard, LocateFixed, SettingsIcon } from "lucide-react";
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
} from "../components/ui/input-group";
import { Switch } from "../components/ui/switch";
import { KeyTask, KeyData, KeyState } from "../type";

export const Settings = ({
  data,
  state,
  task,
}: {
  data: KeyData;
  state: KeyState;
  task: KeyTask;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <SettingsIcon />
          设置
        </CardTitle>
        <CardDescription>配置快捷键和坐标地址</CardDescription>
      </CardHeader>
      <CardContent>
        <div className=" space-y-3">
          <Field>
            <FieldLabel>输入框坐标</FieldLabel>
            <InputGroup className="max-w-full">
              <InputGroupInput value={data?.xy} placeholder="0,0" />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  variant={state.isGetMouseXY ? "destructive" : "ghost"}
                  onClick={() => task.captureMouseXY?.()}
                  className="cursor-pointer"
                >
                  <LocateFixed />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field orientation="horizontal" className="">
            <FieldLabel>执行快捷键</FieldLabel>
            <InputGroup className="max-w-22">
              <InputGroupInput placeholder="F8" />
              <InputGroupAddon align="inline-end">
                <Keyboard />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field orientation="horizontal" className="">
            <FieldLabel>跳过快捷键</FieldLabel>
            <InputGroup className="max-w-22">
              <InputGroupInput placeholder="F9" />
              <InputGroupAddon align="inline-end">
                <Keyboard />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field orientation="horizontal" className="">
            <FieldLabel>监听状态</FieldLabel>
            <Switch
              checked={state.isMonitor}
              onCheckedChange={task.toggleMonitor}
            />
          </Field>
        </div>
      </CardContent>
    </Card>
  );
};
