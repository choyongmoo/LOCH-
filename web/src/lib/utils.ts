import { clsx, type ClassValue } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function supportsScreenSharing(): boolean {
  return (
    typeof navigator !== "undefined" &&
    navigator.mediaDevices &&
    !!navigator.mediaDevices.getDisplayMedia
  );
}

export function mergeProps<T extends Record<string, unknown>, U extends Record<string, unknown>>(
  a: T,
  b: U
): T & U {
  const result: Record<string, unknown> = { ...a };

  for (const key of Object.keys(b)) {
    const av = (a as Record<string, unknown>)[key];
    const bv = (b as Record<string, unknown>)[key];

    if (key === "className") {
      result.className = cn(av as string | undefined, bv as string | undefined);
      continue;
    }

    const isEvent = (/^on[A-Z]/.test(key) && typeof av === "function") || typeof bv === "function";
    if (isEvent) {
      const fnA = typeof av === "function" ? (av as (...args: unknown[]) => unknown) : undefined;
      const fnB = typeof bv === "function" ? (bv as (...args: unknown[]) => unknown) : undefined;
      if (fnA && fnB) {
        result[key] = (...args: unknown[]) => {
          fnA(...args);
          return fnB(...args);
        };
      } else {
        result[key] = fnB ?? fnA;
      }
      continue;
    }

    // Default: second overrides first
    result[key] = bv;
  }

  return result as T & U;
}

export function cloneSingleChild(
  children: React.ReactNode | React.ReactNode[],
  props?: Record<string, unknown>,
  key?: unknown
) {
  return React.Children.map(children, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child) && React.Children.only(children)) {
      const element = child as React.ReactElement<Record<string, unknown>>;
      const elementProps = (element.props ?? {}) as Record<string, unknown>;
      if (typeof elementProps.className === "string" && elementProps.className.length > 0) {
        // make sure we retain classnames of both passed props and child
        props ??= {};
        props.className = clsx(elementProps.className as string, (props.className as string) ?? "");
        props.style = {
          ...((elementProps.style as Record<string, unknown>) ?? {}),
          ...((props.style as Record<string, unknown>) ?? {}),
        };
      }
      return React.cloneElement(element, {
        ...(props as Record<string, unknown>),
        key: key as React.Key | undefined,
      });
    }
    return child;
  });
}

// ----- Shared helpers for meeting logs -----

export type TranscriptJson =
  | Array<{ timestamp?: number; participant?: string; transcript?: string }>
  | null
  | undefined;

export function formatSeconds(input: number): string {
  if (!Number.isFinite(input) || input < 0) return "0:00";
  const total = Math.floor(input);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const mm = hours > 0 ? String(minutes).padStart(2, "0") : String(minutes);
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function parseTimeInput(input: string): number {
  try {
    const s = input.trim();
    if (!s) return Number.NaN;
    if (/^\d+(\.\d+)?$/.test(s)) return Number(s);
    const parts = s.split(":").map((p) => Number(p));
    if (parts.some((n) => Number.isNaN(n))) return Number.NaN;
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return Number.NaN;
  } catch {
    return Number.NaN;
  }
}

export function getTranscriptEntries(
  transcript: unknown
): Array<{ timestamp: number; participant?: string; transcript: string }> {
  try {
    const t = transcript as TranscriptJson;
    if (!Array.isArray(t)) return [];
    return t
      .filter(
        (it) =>
          !!it &&
          typeof it === "object" &&
          typeof (it as { transcript?: unknown }).transcript === "string" &&
          typeof (it as { timestamp?: unknown }).timestamp === "number"
      )
      .map((it) => ({
        timestamp: (it as { timestamp: number }).timestamp,
        participant: (it as { participant?: string }).participant,
        transcript: (it as { transcript: string }).transcript,
      }));
  } catch {
    return [];
  }
}

export function getTotalSecondsFromLog(
  log: {
    started_at?: string;
    ended_at?: string;
    transcript?: unknown;
  } | null
): number {
  if (!log) return 0;
  const entries = getTranscriptEntries(log?.transcript);
  const byItems = entries.length > 0 ? entries[entries.length - 1].timestamp : 0;
  const ended = log?.ended_at ? new Date(log.ended_at).getTime() : 0;
  const started = log?.started_at ? new Date(log.started_at).getTime() : 0;
  const byClock = Number.isFinite(ended - started)
    ? Math.max(0, Math.round((ended - started) / 1000))
    : 0;
  return Math.max(byItems, byClock);
}

export function downloadJson(data: unknown, filename: string) {
  try {
    const raw = JSON.stringify(data ?? {}, null, 2);
    const blob = new Blob([raw], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    /* ignore */
  }
}

export function parseDate(value: string) {
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    const yyyy = String(d.getFullYear());
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    const hours24 = d.getHours();
    const ampm = hours24 < 12 ? "오전" : "오후";
    const h12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const hh = String(h12).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");

    return `${yyyy}/${mm}/${dd} ${hh}:${mi}:${ss} ${ampm}`;
  } catch {
    return "-";
  }
}
