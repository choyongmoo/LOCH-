import { Button } from "@/components/common/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/common/ui/sheet";
import React from "react";

type SummarySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: string | null | undefined;
  started_at: string | null | undefined;
};

export const SummarySheet: React.FC<SummarySheetProps> = ({
  open,
  onOpenChange,
  summary,
  started_at,
}) => {
  const handleDownload = React.useCallback(() => {
    const s = summary?.trim();
    if (!s) return;
    const blob = new Blob([s], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `summary-${started_at?.slice(0, 19)}`.replace(/[^a-zA-Z0-9._-]+/g, "-") + ".txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [summary]);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>요약본</SheetTitle>
          <SheetDescription>회의 요약 내용을 확인하세요.</SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <div className="whitespace-pre-wrap text-sm leading-6 text-gray-900 dark:text-gray-100">
            {summary || "내용이 없습니다."}
          </div>
          <div className="mt-3">
            <Button size="sm" variant="outline" onClick={handleDownload} disabled={!summary}>
              다운로드
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
