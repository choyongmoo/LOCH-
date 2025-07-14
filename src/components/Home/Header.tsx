import { useThemeStore } from "@/store/themeStore";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router";
import { Logo } from "../common/Logo";
import { Button } from "../common/ui/button";

export const Header = () => {
  const { toggleTheme } = useThemeStore();

  return (
    <header className="flex items-center justify-between p-8">
      <div className="pointer-events-auto">
        <Logo />
      </div>
      <div className="flex items-center gap-4 pointer-events-auto">
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          <Sun className="scale-130 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-110" />
        </Button>
        <Button asChild>
          <Link to="/signin">로그인</Link>
        </Button>
      </div>
    </header>
  );
};
