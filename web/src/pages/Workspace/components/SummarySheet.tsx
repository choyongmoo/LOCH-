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
};

export const SummarySheet: React.FC<SummarySheetProps> = ({ open, onOpenChange, summary }) => {
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
        </div>
      </SheetContent>
    </Sheet>
  );
};
