import { Button } from "@/components/common/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/common/ui/sheet";
import { supabase } from "@/lib/supabase";
import {
  formatSeconds,
  getTotalSecondsFromLog,
  getTranscriptEntries,
  parseTimeInput,
} from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

type PartialSummarySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: { id?: string; started_at?: string; ended_at?: string; transcript?: unknown } | null;
};

export const PartialSummarySheet: React.FC<PartialSummarySheetProps> = ({
  open,
  onOpenChange,
  log,
}) => {
  const total = React.useMemo(() => getTotalSecondsFromLog(log), [log]);
  const [startText, setStartText] = React.useState<string>("0");
  const [endText, setEndText] = React.useState<string>("" + total);
  const [summary, setSummary] = React.useState<string>("");
  const [isSummarizing, setIsSummarizing] = React.useState<boolean>(false);

  const storageKey = React.useMemo(() => (log?.id ? `partial-summary:${log.id}` : null), [log?.id]);

  React.useEffect(() => {
    if (!log?.id) return;
    try {
      if (typeof window !== "undefined" && storageKey) {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const data = JSON.parse(raw) as {
            startText?: string;
            endText?: string;
            summary?: string;
          };
          setStartText(data.startText ?? "0");
          setEndText(data.endText ?? formatSeconds(total));
          setSummary(data.summary ?? "");
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to load partial summary from localStorage", e);
    }
    setStartText("0");
    setEndText(formatSeconds(total));
    setSummary("");
  }, [log?.id, total, storageKey]);

  const handleDownload = React.useCallback(() => {
    const s = summary?.trim();
    if (!s) return;
    const content = [
      "부분 요약",
      `로그 ID: ${log?.id ?? "-"}`,
      `시간 구간: ${startText} ~ ${endText}`,
      "",
      s,
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeId = String(log?.id ?? "unknown");
    const fileName = `partial-summary-${safeId}-${startText}-${endText}.txt`.replace(
      /[^a-zA-Z0-9._-]+/g,
      "_"
    );
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [summary, log?.id, startText, endText]);

  const doSummarize = async () => {
    try {
      setIsSummarizing(true);
      const startParsed = parseTimeInput(startText);
      const endParsed = parseTimeInput(endText);

      if (Number.isNaN(startParsed) || Number.isNaN(endParsed)) {
        setSummary("시간 형식이 올바르지 않습니다. (예: 90 또는 1:30)");
        return;
      }

      if (startParsed > endParsed) {
        setSummary("시작 시간이 끝 시간보다 클 수 없습니다.");
        return;
      }

      const startSeconds = Math.floor(startParsed);
      const endSeconds = Math.floor(endParsed);

      const items = getTranscriptEntries(log?.transcript)
        .filter(
          (i) =>
            Number.isFinite(i.timestamp) && i.timestamp >= startSeconds && i.timestamp <= endSeconds
        )
        .map((i) => {
          const t = i.transcript.trim();
          if (!t) return "";
          return `${i.participant} -> ${t}`;
        })
        .filter((t) => t.length > 0);

      if (items.length === 0) {
        setSummary("요약할 텍스트가 없습니다.");
        return;
      }

      const text = items.map((t) => `- ${t}`).join("\n");

      const result = await supabase.functions.invoke("meeting-summary", {
        body: { text },
      });

      const finalSummary =
        result.data?.summary || result.error?.message || "요약 중 오류가 발생했습니다.";
      setSummary(finalSummary);

      // Save only when summarization completes
      try {
        if (typeof window !== "undefined" && storageKey) {
          const payload = JSON.stringify({
            startText,
            endText,
            summary: finalSummary,
            updatedAt: Date.now(),
          });
          localStorage.setItem(storageKey, payload);
        }
      } catch (e) {
        console.warn("Failed to save partial summary to localStorage", e);
      }
    } catch (e) {
      setSummary((e as { message?: string })?.message || "요약 중 오류가 발생했습니다.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>부분 요약</SheetTitle>
          <SheetDescription>시간 구간을 선택해 간단 요약을 확인하세요.</SheetDescription>
        </SheetHeader>
        <div className="p-4 space-y-4">
          <div className="text-xs text-gray-600 dark:text-gray-300">
            전체 길이: {formatSeconds(total)}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <input
                value={startText}
                onChange={(e) => setStartText(e.target.value)}
                placeholder="시작 (초 또는 mm:ss)"
                className="h-8 w-40 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-[#2a2b36] dark:text-gray-100"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">~</span>
              <input
                value={endText}
                onChange={(e) => setEndText(e.target.value)}
                placeholder="끝 (초 또는 mm:ss)"
                className="h-8 w-40 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-[#2a2b36] dark:text-gray-100"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setStartText("0");
                  setEndText(String(Math.floor(total)));
                }}
              >
                전체 선택
              </Button>
              <Button size="sm" onClick={doSummarize} disabled={isSummarizing}>
                {isSummarizing ? (
                  <>
                    <Loader2 className="animate-spin" />
                    처리 중...
                  </>
                ) : (
                  "간단 요약"
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">요약</div>
            <div className="whitespace-pre-wrap text-sm leading-6 text-gray-900 dark:text-gray-100">
              {summary || "구간을 선택하고 요약을 실행하세요."}
            </div>
            <Button size="sm" variant="outline" onClick={handleDownload} disabled={!summary}>
              다운로드
            </Button>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-4">
              선택 구간 대화
            </div>
            <div className="max-h-[50vh] overflow-auto divide-y divide-gray-100 dark:divide-white/10 rounded-md border border-gray-100 dark:border-white/10">
              {(() => {
                const start = Math.max(0, parseTimeInput(startText));
                const end = Math.max(start, parseTimeInput(endText));
                const items = getTranscriptEntries(log?.transcript).filter(
                  (i) => Number.isFinite(i.timestamp) && i.timestamp >= start && i.timestamp <= end
                );
                if (items.length === 0)
                  return (
                    <div className="p-3 text-sm text-gray-500 dark:text-gray-400">
                      표시할 항목이 없습니다.
                    </div>
                  );
                return (
                  <div className="p-2 space-y-2">
                    {items.map((it, idx) => (
                      <div key={`${it.timestamp}-${idx}`} className="flex items-start gap-3">
                        <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-xs font-mono text-gray-700 dark:text-gray-200">
                          <button>{formatSeconds(it.timestamp)}</button>
                        </span>
                        <p className={"text-sm leading-6 text-gray-900 dark:text-gray-100"}>
                          {[`[${it.participant}] `, it.transcript].join("")}
                        </p>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
