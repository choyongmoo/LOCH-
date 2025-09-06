import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/themeStore";
import { supabase } from "@/lib/supabase";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router";
import { Logo } from "../common/Logo";
import { Button } from "../common/ui/button";
import UserMenu from "@/components/common/ui/UserMenu";

export const Header = () => {
  const { toggleTheme } = useThemeStore();
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setHasUser(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setHasUser(!!s?.user)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="flex items-center justify-between p-8">
      <div className="pointer-events-auto">
        <Logo />
      </div>
      <div className="flex items-center gap-4 pointer-events-auto">
        <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          <Sun className="scale-130 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-110" />
        </Button>

        {hasUser ? (
          <UserMenu />
        ) : (
          <Button asChild>
            <Link to="/signin">로그인</Link>
          </Button>
        )}
      </div>
    </header>
  );
};
