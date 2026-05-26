export type Hwnd = {
  className?: string;
  corners?: Corners;
  hwnd?: string;
  mousePos?: MousePos;
};

export type Corners = {
  bottomLeft?: MousePos;
  bottomRight?: MousePos;
  topLeft?: MousePos;
  topRight?: MousePos;
};

export type MousePos = {
  x?: number;
  y?: number;
};

export type KeyData = {
  textArray?: string[];
  currentIndex?: number;
  xy?: string;
  mode?: string;
  style?: string[];
  singer?: string;
  sendText?: string;
};

export type KeyState = {
  isMonitor?: boolean;
  mode?: string;
  isGetMouseXY?: boolean;
  isShowSinger?: boolean;
  isShowStyle?: boolean;
};

export type KeyAction = {
  toggleMode?: () => void;
  setTextArray?: (textArray: string[]) => void;
  setCurrentIndex?: (index: number) => void;
  setXy?: (xy: string) => void;
  setMode?: (mode: string) => void;
  setIsShowSinger?: (isShowSinger: boolean) => void;
  setIsShowStyle?: (isShowStyle: boolean) => void;
  setStyle?: (style: string[]) => void;
  setSinger?: (singer: string) => void;
  setSendText?: (sendText: string) => void;
};

export type KeyTask = {
  startMonitor?: () => void;
  stopMonitor?: () => void;
  toggleMonitor?: () => void;
  captureMouseXY?: () => Promise<void>;
};
