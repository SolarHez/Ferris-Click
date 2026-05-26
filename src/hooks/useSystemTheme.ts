import { useState, useEffect } from "react";

export function useSystemTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    window.addEventListener("contextmenu", (event) => {
      event.preventDefault(); // 阻止浏览器默认菜单弹出
    });

    const updateTheme = (isDark: boolean) => {
      const newTheme = isDark ? "dark" : "light";
      setTheme(newTheme);

      const root = window.document.documentElement;

      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      root.setAttribute("data-theme", newTheme);
    };

    // 初始化调用
    updateTheme(mediaQuery.matches);

    // 监听系统变化
    const handleChange = (e: MediaQueryListEvent) => updateTheme(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return theme;
}
