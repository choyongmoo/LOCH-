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
  getTranscriptItems,
  parseTimeInput,
} from "@/lib/utils";
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

  React.useEffect(() => {
    setStartText("0");
    setEndText(String(Math.floor(total)));
    setSummary("");
  }, [total, open]);

  const doSummarize = async () => {
    try {
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

      const result = await supabase.functions.invoke("meeting-summary", {
        body: {
          start: startSeconds,
          end: endSeconds,
          transcript: log?.transcript,
        },
      });

      setSummary(result.data?.summary || result.error?.message || "요약 중 오류가 발생했습니다.");
    } catch (e) {
      setSummary((e as { message?: string })?.message || "요약 중 오류가 발생했습니다.");
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
              <Button size="sm" onClick={doSummarize}>
                간단 요약
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">요약</div>
            <div className="whitespace-pre-wrap text-sm leading-6 text-gray-900 dark:text-gray-100">
              {summary || "구간을 선택하고 요약을 실행하세요."}
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-4">
              선택 구간 대화
            </div>
            <div className="max-h-[50vh] overflow-auto divide-y divide-gray-100 dark:divide-white/10 rounded-md border border-gray-100 dark:border-white/10">
              {(() => {
                const start = Math.max(0, parseTimeInput(startText));
                const end = Math.max(start, parseTimeInput(endText));
                const items = getTranscriptItems(log?.transcript).filter(
                  (i) => Number.isFinite(i.time) && i.time >= start && i.time <= end
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
                      <div key={`${it.time}-${idx}`} className="flex items-start gap-3">
                        <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-xs font-mono text-gray-700 dark:text-gray-200">
                          {formatSeconds(it.time)}
                        </span>
                        <p className="text-sm leading-6 text-gray-900 dark:text-gray-100">
                          {it.text}
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
