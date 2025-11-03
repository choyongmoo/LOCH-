import { Button } from "@/components/common/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/common/ui/sheet";
import {
  downloadJson,
  formatSeconds,
  getTotalSecondsFromLog,
  getTranscriptEntries,
  parseTimeInput,
} from "@/lib/utils";
import React from "react";

type TranscriptSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: { id?: string; started_at?: string; ended_at?: string; transcript?: unknown } | null;
};

export const TranscriptSheet: React.FC<TranscriptSheetProps> = ({ open, onOpenChange, log }) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [jumpInput, setJumpInput] = React.useState<string>("");
  const [highlightId, setHighlightId] = React.useState<string | null>(null);

  const scrollToTime = (seconds: number) => {
    try {
      const entries = getTranscriptEntries(log?.transcript);
      if (entries.length === 0 || !Number.isFinite(seconds) || seconds < 0) return;
      let nearestIndex = 0;
      let nearestDiff = Number.POSITIVE_INFINITY;
      for (let i = 0; i < entries.length; i++) {
        const diff = Math.abs(entries[i].timestamp - seconds);
        if (diff < nearestDiff) {
          nearestDiff = diff;
          nearestIndex = i;
        }
      }
      const target = entries[nearestIndex];
      const id = `transcript-item-${Math.round(target.timestamp * 1000)}`;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        setHighlightId(id);
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>대화 기록</SheetTitle>
          <SheetDescription>원본 대화 기록(JSON)을 확인하세요.</SheetDescription>
          <div className="mt-3 mb-3 flex justify-start">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                downloadJson(
                  log?.transcript,
                  `transcript-${log?.started_at?.slice(0, 19)}`.replace(/[^a-zA-Z0-9._-]+/g, "-") +
                    ".json"
                )
              }
            >
              다운로드
            </Button>
          </div>
        </SheetHeader>
        <div className="p-4">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <input
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const sec = parseTimeInput(jumpInput);
                    if (Number.isFinite(sec)) {
                      e.preventDefault();
                      scrollToTime(sec);
                    }
                  }
                }}
                placeholder="예: 90 또는 1:30"
                className="h-8 w-40 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-[#2a2b36] dark:text-gray-100"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const sec = parseTimeInput(jumpInput);
                  if (Number.isFinite(sec)) scrollToTime(sec);
                }}
              >
                이동
              </Button>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                총 {formatSeconds(getTotalSecondsFromLog(log))}
              </div>
            </div>
          </div>
          {(() => {
            const entries = getTranscriptEntries(log?.transcript);
            if (entries.length > 0) {
              return (
                <div ref={containerRef} className="max-h-[70vh] overflow-auto space-y-3">
                  {entries.map((it, idx) => {
                    const id = `transcript-item-${Math.round(it.timestamp * 1000)}`;
                    const isHighlight = id === highlightId;
                    return (
                      <div
                        id={id}
                        key={`${it.timestamp}-${idx}`}
                        className="flex items-start gap-3"
                      >
                        <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-xs font-mono text-gray-700 dark:text-gray-200">
                          <button
                            className="hover:underline"
                            onClick={() => scrollToTime(it.timestamp)}
                          >
                            {formatSeconds(it.timestamp)}
                          </button>
                        </span>
                        <p
                          className={
                            isHighlight
                              ? "text-sm leading-6 text-gray-900 dark:text-gray-100 underline underline-offset-2 decoration-2"
                              : "text-sm leading-6 text-gray-900 dark:text-gray-100"
                          }
                        >
                          {[`[${it.participant}] `, it.transcript].join("")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              );
            }
            return (
              <pre className="max-h-[70vh] overflow-auto rounded-md bg-black/5 dark:bg-white/5 p-3 text-xs leading-5 text-gray-800 dark:text-gray-200">
                {JSON.stringify(log?.transcript, null, 2) || "{}"}
              </pre>
            );
          })()}
        </div>
      </SheetContent>
    </Sheet>
  );
};
