import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./page/home";
import CaptureWindow from "./layout/window";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/capture" element={<CaptureWindow />} />
      </Routes>
    </HashRouter>
  );
}
