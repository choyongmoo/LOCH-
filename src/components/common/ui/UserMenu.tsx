import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ChevronDown, ChevronUp, LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router";

type SupaUser = {
  email?: string;
  user_metadata?: Record<string, any>;
} | null;

export default function UserMenu() {
  const nav = useNavigate();
  const [user, setUser] = useState<SupaUser>(null);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user as any));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setUser((s?.user as any) ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current || !anchorRef.current) return;
      const t = e.target as Node;
      if (menuRef.current.contains(t) || anchorRef.current.contains(t)) return;
      setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const name: string = useMemo(() => {
    const n =
      (user?.user_metadata?.name as string) ||
      (user?.user_metadata?.full_name as string) ||
      (user?.email ? user.email.split("@")[0] : "");
    return n || "사용자";
  }, [user]);

  const email = user?.email ?? "";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    nav("/");
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        ref={anchorRef}
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-2 rounded-xl border border-foreground/10 bg-card px-3.5 py-2 shadow-sm hover:bg-accent transition"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <div className="grid h-6 w-6 place-items-center rounded-full bg-muted text-xs font-bold">
          {initials}
        </div>
        <span className="text-sm font-semibold">{name}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 opacity-70" />
        ) : (
          <ChevronDown className="h-4 w-4 opacity-70" />
        )}
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute right-0 mt-2 w-[260px] rounded-2xl border border-foreground/10 bg-card shadow-xl overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-muted text-sm font-extrabold">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
          <div className="h-px bg-foreground/10" />
          
          <div className="py-1">
            <MenuItem
              icon={<LayoutDashboard className="h-4 w-4" />}
              label="워크스페이스"
              onClick={() => {
                setOpen(false);
                nav("/workspace");
              }}
            />
          </div>

          <div className="h-px bg-foreground/10" />
          <div className="py-1">
            <MenuItem
              icon={<LogOut className="h-4 w-4" />}
              label="로그아웃"
              destructive
              onClick={handleLogout}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  destructive,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center justify-start gap-3 px-4 py-2.5 text-sm",
        "hover:bg-accent transition",
        destructive ? "text-red-600 dark:text-red-400" : "text-foreground",
      ].join(" ")}
      role="menuitem"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
