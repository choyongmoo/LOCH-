import React from "react";

// 타입 정의
export type ContentType = "powerpoint" | "spreadsheet" | "memo" | "code";

export interface BaseItem {
  id: string;
  title: string;
  createdAt: Date;
  type: ContentType;
}

export interface PowerPointItem extends BaseItem {
  type: "powerpoint";
  slides: number;
}

export interface SpreadsheetItem extends BaseItem {
  type: "spreadsheet";
  rows: number;
  columns: number;
}

export interface MemoItem extends BaseItem {
  type: "memo";
  content: string;
}

export interface CodeItem extends BaseItem {
  type: "code";
  language: string;
  code: string;
}

export type Item = PowerPointItem | SpreadsheetItem | MemoItem | CodeItem;

const exampleItems: Item[] = [
  { id: "1", title: "프로젝트 발표", createdAt: new Date(), type: "powerpoint", slides: 10 },
  { id: "2", title: "예산표", createdAt: new Date(), type: "spreadsheet", rows: 20, columns: 5 },
  { id: "3", title: "회의 메모", createdAt: new Date(), type: "memo", content: "회의 내용 정리" },
  { id: "4", title: "정렬 알고리즘", createdAt: new Date(), type: "code", language: "python", code: "def sort(): pass" },
];

const typeIcon: Record<ContentType, string> = {
  powerpoint: "📊",
  spreadsheet: "📈",
  memo: "📝",
  code: "💻",
};

const typeLabel: Record<ContentType, string> = {
  powerpoint: "파워포인트",
  spreadsheet: "스프레드시트",
  memo: "메모",
  code: "코드",
};

const MunPage = () => {
  return (
    <div className="min-h-screen w-402 bg-white dark:bg-[#18191c] px-5 py-6">
      {/* 상단 버튼 */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <button className="flex items-center gap-2 border border-gray-200 dark:border-[#23242e] rounded-lg px-4 py-2 bg-white dark:bg-[#23242e] hover:bg-gray-50 dark:hover:bg-[#23242e]/80 text-gray-800 dark:text-gray-100 text-base font-medium">
          <span role="img" aria-label="문서">예</span> 새 문서
        </button>
        <button className="flex items-center gap-2 border border-gray-200 dark:border-[#23242e] rounded-lg px-4 py-2 bg-white dark:bg-[#23242e] hover:bg-gray-50 dark:hover:bg-[#23242e]/80 text-gray-800 dark:text-gray-100 text-base font-medium">
          <span role="img" aria-label="테이블">쁜</span> 파워포인트
        </button>
        <button className="flex items-center gap-2 border border-gray-200 dark:border-[#23242e] rounded-lg px-4 py-2 bg-white dark:bg-[#23242e] hover:bg-gray-50 dark:hover:bg-[#23242e]/80 text-gray-800 dark:text-gray-100 text-base font-medium">
          <span role="img" aria-label="별">이</span> 스프레드시트
        </button>
        <button className="flex items-center gap-2 border border-gray-200 dark:border-[#23242e] rounded-lg px-4 py-2 bg-white dark:bg-[#23242e] hover:bg-gray-50 dark:hover:bg-[#23242e]/80 text-gray-800 dark:text-gray-100 text-base font-medium">
          <span role="img" aria-label="템플릿">미</span> 코드 편집
        </button>
        <button className="flex items-center gap-2 border border-gray-200 dark:border-[#23242e] rounded-lg px-4 py-2 bg-white dark:bg-[#23242e] hover:bg-gray-50 dark:hover:bg-[#23242e]/80 text-gray-800 dark:text-gray-100 text-base font-medium">
          <span role="img" aria-label="가져오기">지</span> 가져오기
        </button>
      </div>
      {/* 테이블 헤더 */}
      <div className="flex items-center px-2 py-2 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-[#23242e]">
        <div className="w-8"></div>
        <div className="flex-1">제목</div>
        <div className="w-36 text-center">분류</div>
        <div className="w-32 text-center">작성자</div>
        <div className="w-32 text-center">작성일</div>
      </div>
      {/* 자료 리스트 */}
      <div className="divide-y divide-gray-100 dark:divide-[#23242e]">
        {exampleItems.map((item) => (
          <div key={item.id} className="flex items-center px-2 py-3 hover:bg-gray-50 dark:hover:bg-[#23242e]/60">
            <div className="w-8 text-lg">{typeIcon[item.type]}</div>
            <div className="flex-1 text-gray-800 dark:text-gray-100 truncate">{item.title}</div>
            <div className="w-36 text-center flex items-center justify-center gap-1">
              <span className="text-base">{typeLabel[item.type]}</span>
            </div>
            <div className="w-32 text-center flex items-center justify-center gap-1">
              <span className="inline-block w-6 h-6 rounded-full bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-200 font-bold flex items-center justify-center text-xs">오택현</span>
            </div>
            <div className="w-32 text-center text-gray-500 dark:text-gray-300 text-sm">{item.createdAt.toLocaleDateString()}</div>
          </div>
        ))}
        {exampleItems.length === 0 && (
          <div className="text-center text-gray-400 py-8">자료 없음</div>
        )}
      </div>
    </div>
  );
};

export default MunPage;
