import { Button } from "../../common/ui/button";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export function ThemeToggleButton() {
    const { theme, toggleTheme } = useThemeStore();
    const isLight = theme === "light";

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <Sun
        className={`active:scale-95 transition-all ${isLight ? "scale-130" : "scale-0 -rotate-90"}`}
      />
      <Moon
        className={`active:scale-95 absolute transition-all ${isLight ? "scale-0 rotate-90" : "scale-110 rotate-0"}`}
      />
    </Button>
  );
}