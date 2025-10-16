import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/common/ui/button";
import screenshot from "@/assets/landing/river_dashboard.png";

import windowsIcon from "@/assets/landing/windows.png";
import windowsIconDark from "@/assets/landing/windows2.svg";


const WINDOWS_EXE =
  "https://github.com/choyongmoo/LOCH-/releases/download/Production/river_app.zip";

export const Download = () => {
  const ref = useRef<HTMLElement | null>(null);
  const [pos, setPos] = useState({ x: 70, y: 30 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      setPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section id="download" ref={ref} className="relative w-full bg-transparent">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(600px 300px at ${pos.x}% ${pos.y}%, rgba(0,0,0,0.06), transparent 60%)`,
          }}
        />
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            background: `radial-gradient(600px 300px at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.07), transparent 60%)`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground">
            앱 다운로드
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Windows용 LOCH 데스크톱 앱입니다. 설치 후 로그인하면 바로 사용할 수 있습니다.
          </p>

          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="group h-12 w-full max-w-sm rounded-full px-6 bg-foreground text-background hover:opacity-90 shadow-sm"
              title="Download for Windows (x64)"
            >
              <a
                href={WINDOWS_EXE}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 font-semibold"
              >
                <img
                  src={windowsIcon}
                  alt=""
                  aria-hidden
                  className="h-5 w-5 object-contain dark:hidden"
                />
                <img
                  src={windowsIconDark}
                  alt=""
                  aria-hidden
                  className="h-5 w-5 object-contain hidden dark:block"
                />
                <span>Download for Windows</span>
                <span
                  aria-hidden
                  className="translate-x-0 transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </a>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl ring-1 ring-inset ring-foreground/10 bg-transparent">
            <div className="flex h-9 items-center justify-between border-b border-foreground/10 bg-muted/40 px-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm border border-foreground/20">
                  <span className="block h-0.5 w-0.5 bg-foreground/60 mr-[1px]" />
                  <span className="block h-0.5 w-0.5 bg-foreground/60 inline-block" />
                </span>
                <span>Workspace</span>
              </div>
              <div className="flex items-center gap-1">
                <WinBtn ariaLabel="Minimize">—</WinBtn>
                <WinBtn ariaLabel="Maximize">□</WinBtn>
                <WinBtn ariaLabel="Close" danger>
                  ×
                </WinBtn>
              </div>
            </div>
            <img src={screenshot} alt="App screenshot" className="block w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Download;

function WinBtn({
  children,
  ariaLabel,
  danger,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  danger?: boolean;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className={`grid h-7 w-9 place-items-center rounded hover:opacity-90
      ${
        danger
          ? "text-red-500/80 hover:text-red-600"
          : "text-muted-foreground hover:text-foreground"
      }`}
      type="button"
      tabIndex={-1}
    >
      <span
        className={
          danger
            ? "inline-block text-[18px] font-bold leading-none -translate-y-[2px]"
            : "text-xs leading-none"
        }
      >
        {children}
      </span>
    </button>
  );
}
