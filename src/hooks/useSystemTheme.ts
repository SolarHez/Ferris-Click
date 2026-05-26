import { useEffect, useState } from "react";

export function useSystemTheme() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  const updateTheme = (isDark: boolean) => {
    const newTheme = isDark ? "dark" : "light";
    const root = window.document.documentElement;

    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    root.setAttribute("data-theme", newTheme);
  };

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    window.addEventListener("contextmenu", (event) => {
      event.preventDefault(); // 阻止浏览器默认菜单弹出
    });

    const handleChange = (e: MediaQueryListEvent) => updateTheme(e.matches);
    if (theme === "system") {
      updateTheme(mediaQuery.matches);
      mediaQuery.addEventListener("change", handleChange);
      return;
    }

    if (theme === "light") {
      updateTheme(false);
    }

    if (theme === "dark") {
      updateTheme(true);
    }

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return { theme, setTheme, handleToggleTheme };
}
