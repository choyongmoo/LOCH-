import { useEffect, useMemo, useRef, useState } from "react";

export type BreakpointName = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const BREAKPOINT_PIXELS: Record<Exclude<BreakpointName, "xs">, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

function getBreakpointName(width: number): BreakpointName {
  if (width < BREAKPOINT_PIXELS.sm) return "xs";
  if (width < BREAKPOINT_PIXELS.md) return "sm";
  if (width < BREAKPOINT_PIXELS.lg) return "md";
  if (width < BREAKPOINT_PIXELS.xl) return "lg";
  if (width < BREAKPOINT_PIXELS["2xl"]) return "xl";
  return "2xl";
}

export interface UseBreakpointOptions {
  debounceMs?: number;
}

export interface BreakpointState {
  width: number;
  height: number;
  breakpoint: BreakpointName;
  up: Record<BreakpointName, boolean>;
  down: Record<BreakpointName, boolean>;
}

export function useBreakpoint(options?: UseBreakpointOptions): BreakpointState {
  const { debounceMs = 120 } = options ?? {};

  const isBrowser = typeof window !== "undefined";
  const [size, setSize] = useState<{ width: number; height: number }>(() => ({
    width: isBrowser ? window.innerWidth : 0,
    height: isBrowser ? window.innerHeight : 0,
  }));

  const rafIdRef = useRef<number | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isBrowser) return;

    const handleResize = () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        if (debounceTimerRef.current != null) window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = window.setTimeout(() => {
          setSize({ width: window.innerWidth, height: window.innerHeight });
        }, debounceMs);
      });
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize as EventListener);
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      if (debounceTimerRef.current != null) window.clearTimeout(debounceTimerRef.current);
    };
  }, [debounceMs, isBrowser]);

  const breakpoint = useMemo(() => getBreakpointName(size.width), [size.width]);

  const up = useMemo(() => {
    const w = size.width;
    return {
      xs: w >= 0,
      sm: w >= BREAKPOINT_PIXELS.sm,
      md: w >= BREAKPOINT_PIXELS.md,
      lg: w >= BREAKPOINT_PIXELS.lg,
      xl: w >= BREAKPOINT_PIXELS.xl,
      "2xl": w >= BREAKPOINT_PIXELS["2xl"],
    } satisfies Record<BreakpointName, boolean>;
  }, [size.width]);

  const down = useMemo(() => {
    const w = size.width;
    return {
      xs: w < BREAKPOINT_PIXELS.sm,
      sm: w < BREAKPOINT_PIXELS.md,
      md: w < BREAKPOINT_PIXELS.lg,
      lg: w < BREAKPOINT_PIXELS.xl,
      xl: w < BREAKPOINT_PIXELS["2xl"],
      "2xl": true,
    } satisfies Record<BreakpointName, boolean>;
  }, [size.width]);

  return {
    width: size.width,
    height: size.height,
    breakpoint,
    up,
    down,
  };
}


