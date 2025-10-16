import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ChevronDown, ChevronUp, LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router";

type SupaUser = { id: string; email?: string } | null;
type ProfileRow = { nickname: string | null; email: string | null };

export default function UserMenu() {
  const nav = useNavigate();
  const [user, setUser] = useState<SupaUser>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  const [ready, setReady] = useState(false);

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const loadProfile = async (uid: string) => {
    const { data, error } = await supabase
      .from("profile")  
      .select("nickname,email") 
      .eq("id", uid)
      .single();
    if (!error) setProfile({ nickname: data?.nickname ?? null, email: data?.email ?? null });
  };

  useEffect(() => {
    let realtime: ReturnType<typeof supabase.channel> | null = null;

    const init = async () => {
      setReady(false);
      const { data } = await supabase.auth.getUser();
      const u = (data.user as any) ?? null;

      if (!u) {
        setUser(null);
        setProfile(null);
        setReady(true);
        return;
      }

      await loadProfile(u.id);     
      setUser({ id: u.id, email: u.email ?? undefined });
      setReady(true);

      realtime = supabase
        .channel("self-profile")
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "profile", filter: `id=eq.${u.id}` },
          (payload) => {
            const row = payload.new as any;
            setProfile({
              nickname: row?.nickname ?? null,
              email: row?.email ?? null,
            });
          }
        )
        .subscribe();
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, s) => {
      setReady(false);
      const next = (s?.user as any) ?? null;

      if (!next) {
        setUser(null);
        setProfile(null);
        setReady(true);
        return;
      }

      await loadProfile(next.id);   
      setUser({ id: next.id, email: next.email ?? undefined });
      setReady(true);
    });

    return () => {
      sub.subscription.unsubscribe();
      if (realtime) supabase.removeChannel(realtime);
    };
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
    if (!profile?.nickname) {
      const em = profile?.email ?? user?.email ?? "";
      return em ? em.split("@")[0] : "사용자";
    }
    return profile.nickname;
  }, [profile?.nickname, profile?.email, user?.email]);

  const email = profile?.email ?? user?.email ?? "";
  const initials = (name || "U")
    .split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    nav("/");
  };


  if (!ready || !user) return null;

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
