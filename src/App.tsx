import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./page/home";
import CaptureWindow from "./layout/window";
import { useSystemTheme } from "./hooks/useSystemTheme";

export default function App() {
  useSystemTheme();
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/capture" element={<CaptureWindow />} />
      </Routes>
    </HashRouter>
  );
}
