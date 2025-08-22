import { useState } from "react";
import { Heading } from "@/components/common/ui/Heading";
import { Paragraph } from "@/components/common/ui/Paragraph";
import { Separator } from "@/components/common/ui/separator";
import { Button } from "@/components/common/ui/button";

const docsSections = [
  {
    id: "code",
    title: "코드 협업",
    description:
      "실시간 코드 편집, GitHub 연동, 코드 리뷰 기능까지 지원합니다.",
    content: (
      <>
        <Paragraph>
          여러 사용자가 동시에 코드 파일을 수정할 수 있으며, 실시간 커서 이동과 문법 검사를 지원합니다.
        </Paragraph>
        <ul className="list-disc list-inside mt-4 space-y-1">
          <li>실시간 편집 (WebSocket)</li>
          <li>GitHub 연동 → 로그인 및 저장</li>
          <li>PR 스타일 코드 리뷰 (댓글/제안)</li>
          <li>Monaco 또는 CodeMirror 에디터</li>
        </ul>
      </>
    ),
  },
  {
    id: "meeting",
    title: "회의 기능",
    description:
      "일정 등록, 실시간 채팅, 화상 회의 기능이 통합되어 있습니다.",
    content: (
      <>
        <Paragraph>
          캘린더를 통해 회의를 예약하고, 채팅 및 WebRTC 화상회의를 통해 협업이 가능합니다.
        </Paragraph>
        <ul className="list-disc list-inside mt-4 space-y-1">
          <li>Google Calendar API 연동</li>
          <li>화상 회의 (WebRTC 기반)</li>
          <li>회의방 자동 입장 기능</li>
        </ul>
      </>
    ),
  },
  {
    id: "transcript",
    title: "회의록 자동화",
    description: "STT 기반 회의록 생성 및 요약 기능 제공",
    content: (
      <>
        <Paragraph>
          음성을 텍스트로 자동 변환하여 저장하고, 요약 후 PDF로 다운로드할 수 있습니다.
        </Paragraph>
        <ul className="list-disc list-inside mt-4 space-y-1">
          <li>STT (음성 텍스트 변환)</li>
          <li>회의록 요약 → AI 기반</li>
          <li>PDF 다운로드 지원</li>
        </ul>
      </>
    ),
  },
  {
    id: "doc",
    title: "문서 공동 작성",
    description: "에디터를 통한 실시간 문서 편집 및 저장",
    content: (
      <>
        <Paragraph>
          Notion처럼 협업 문서를 함께 작성할 수 있으며, 커서 공유 및 실시간 저장이 가능합니다.
        </Paragraph>
        <ul className="list-disc list-inside mt-4 space-y-1">
          <li>WYSIWYG 기반 에디터</li>
          <li>동시 커서 표시</li>
          <li>버전 히스토리 관리</li>
        </ul>
      </>
    ),
  },
  {
    id: "design",
    title: "디자인 피드백",
    description: "디자인 공유 및 실시간 코멘트",
    content: (
      <>
        <Paragraph>
          이미지 또는 시안을 공유하고, 실시간으로 댓글을 달거나 피드백을 교환할 수 있습니다.
        </Paragraph>
        <ul className="list-disc list-inside mt-4 space-y-1">
          <li>디자인 이미지 공유 (PNG, SVG 등)</li>
          <li>마우스 오버 코멘트 기능</li>
          <li>버전 별 시안 관리</li>
        </ul>
      </>
    ),
  },
];

export const Docs = () => {
  const [openId, setOpenId] = useState<string | null>(docsSections[0].id);

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row gap-12">
        {/* 좌측 섹션 목록 */}
        <aside className="md:w-1/4 space-y-6">
          <Heading level={1} className="text-3xl font-bold">
            기능별 설명서
          </Heading>
          <div className="flex flex-col gap-3">
            {docsSections.map((section) => (
              <Button
                key={section.id}
                variant={openId === section.id ? "default" : "outline"}
                className={`w-full text-left px-4 py-3 rounded-lg shadow-sm transition-all ${
                  openId === section.id
                    ? "bg-primary text-white dark:text-black"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
                onClick={() => setOpenId(section.id)}
          >
            {section.title}
          </Button>
            ))}
          </div>
        </aside>

        {/* 우측 상세 설명 */}
        <section className="md:w-3/4 space-y-6">
          {docsSections.map(
            (section) =>
              openId === section.id && (
                <div key={section.id}>
                  <Heading level={2} className="text-2xl font-semibold">
                    {section.title}
                  </Heading>
                  <Paragraph className="text-muted-foreground mt-2">
                    {section.description}
                  </Paragraph>
                  <Separator className="my-6" />
                  <div className="leading-relaxed text-[15px]">
                    {section.content}
                  </div>
                </div>
              )
          )}
        </section>
      </div>
    </div>
  );
};

export default Docs;
