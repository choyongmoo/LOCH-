import { useParams } from "react-router";
import { Heading } from "@/components/common/ui/Heading";
import { Paragraph } from "@/components/common/ui/Paragraph";
import { Separator } from "@/components/common/ui/separator";


import meeting1 from "@/assets/landing/meeting1.png"; 
import meeting2 from "@/assets/landing/meeting2.png"; 
import meeting3 from "@/assets/landing/meeting3.png"; 
import meeting4 from "@/assets/landing/meeting4.png"; 

function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="mt-4 rounded-xl border bg-card p-4 shadow-sm">
      <img src={src} alt={alt} className="w-full rounded-lg dark:brightness-90" />
      {caption && (
        <figcaption className="mt-3 text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

const PAGES = {
 
  transcript: {
    title: "회의록 자동화",
    desc:
      "회의방에서 발생하는 오디오/상호작용을 기반으로 실시간 자막(STT) → 문장 병합 → 요약 생성까지 자동화합니다. PDF/Markdown 내보내기와 GitHub 업로드도 지원합니다.",
    body: (
      <>
       
        <Paragraph>
          좌측 <b>서버 사이드바</b>에서 P/S/N/C 패널을 생성하거나 기존 <b>인스턴스</b>를 드래그해
          보드에 배치합니다. 각 타일에서 <b>분할/교체</b>를 선택해 2×2 구성까지 확장 가능하며,
          우상단 <b>멤버 바</b>에서는 참가자 확인과 <b>회의방 상세정보</b>를 열 수 있습니다.
          채팅·옵션·프로필/사용자 상세는 모달로 제공됩니다. (자세한 동작은 아래 섹션 참조)
        </Paragraph>
        <ul className="mt-4 list-disc list-inside space-y-1 text-[15px]">
          <li>인스턴스 생성/선택/드래그 & 드롭 (앱 모달/인스턴스 관리)</li>
          <li>화면 <b>교체/분할</b> 선택(최대 4분할), 삭제 시 확인/경고</li>
          <li>옵션(오디오 입·출력 장치/음량/음소거, 알림), 채팅, 회의방 상세정보, 유저 상세, 프로필</li>
        </ul>

        <Separator className="my-8" />

        
        <Heading level={2} className="text-2xl font-bold">기본 화면</Heading>
        <Paragraph className="mt-2">
          회의에 입장하면 보드 중앙의 <b>+</b> 버튼으로 새 패널을 추가할 수 있고, 좌측 사이드바에서
          <b> P(참가자)</b>, <b>S(화면공유)</b>, <b>N(노트)</b>, <b>C(채팅)</b> 타입을 클릭/드래그하여 보드에 배치합니다.
          사이드바 하단에는 <b>마이크/헤드셋 음소거</b>, <b>설정(옵션)</b>, <b>OUT(나가기)</b>가 고정되어 있어
          회의 중에도 즉시 제어가 가능합니다.
        </Paragraph>
        <ul className="mt-3 list-disc list-inside space-y-1 text-[15px]">
          <li>
            <b>서버 사이드바</b>: 타입 버튼(P/S/N/C) 클릭 시 새 인스턴스 생성, 호버 시 해당 타입의
            <b> 인스턴스 목록</b>이 슬라이드로 나타나고, 목록 항목을 <b>드래그하여</b> 보드에 배치하거나
            클릭해 편집/관리 창을 열 수 있음.
          </li>
          <li>아래 컨트롤: 마이크/헤드셋 음소거 토글, 옵션(⚙️), OUT</li>
          <li>우상단: 멤버 아바타 스택 + <b>회의방 상세정보</b> 버튼</li>
        </ul>
        <Figure
          src={meeting4}
          alt="기본 화면"
          caption="기본 화면 — 좌측 사이드바(P/S/N/C), 중앙 + 버튼, 하단 장치 제어, 우상단 멤버·상세 버튼"
        />

        <Separator className="my-10" />

        
        <Heading level={2} className="text-2xl font-bold">영상 분할</Heading>
        <Paragraph className="mt-2">
          보드의 각 타일은 <b>교체</b> 또는 <b>분할</b>할 수 있습니다. 새 앱을 열거나 인스턴스를 드롭하면
          <b> 교체/분할 모달</b>이 뜨며, 최대 <b>4분할(2×2)</b>까지 확장됩니다. 이미 4개면 분할은 비활성화됩니다.
        </Paragraph>
        <ul className="mt-3 list-disc list-inside space-y-1 text-[15px]">
          <li>
            <b>Replace/ Split</b> 선택 모달: 현재 패널을 바꿀지(교체) 또는 레이아웃을 나눌지(분할)
            결정. 패널 수가 4개 이상인 경우 <b>분할 버튼 비활성화</b>.
          </li>
          <li>
            인스턴스 드롭 시: “이 화면을 ‘인스턴스명’으로 교체할까요?” 형태로 표시,
            <b> 분할/교체/취소</b> 버튼 제공.
          </li>
        </ul>
        <Figure
          src={meeting1}
          alt="영상 분할 레이아웃"
          caption="영상 분할 — 드래그 드롭 후 교체/분할 모달에서 동작을 선택, 최대 4분할까지 구성"
        />

        <Separator className="my-10" />

        
        <Heading level={2} className="text-2xl font-bold">회의방 상세정보</Heading>
        <Paragraph className="mt-2">
          우상단 <b>멤버 바</b>의 “회의방 상세정보” 버튼으로 모달을 열 수 있습니다.
          회의의 메타데이터(제목, 일정, 진행 상태), 참가자 규모, 시간 정보, 요약/회의록 진행 상태 등을
          한 화면에서 확인할 수 있도록 설계되어 있습니다. 특정 사용자 아바타를 클릭하면 <b>사용자 상세</b> 모달이 열립니다.
        </Paragraph>
        <ul className="mt-3 list-disc list-inside space-y-1 text-[15px]">
          <li>회의 메타/상태(카드 UI), 설명, 현재 시간 등 핵심 지표 제시</li>
          <li>자동 회의록 활성화 시, 요약/내보내기 상태도 이 영역에서 확인</li>
          <li>아바타 클릭 → <b>사용자 상세</b> (역할/부서/이메일/스킬/프로젝트 등)</li>
        </ul>
        <Figure
          src={meeting2}
          alt="회의방 상세정보"
          caption="회의방 상세정보 — 메타/상태/시간/요약 상황을 집중적으로 보여주는 모달"
        />

        <Separator className="my-10" />

       
        <Heading level={2} className="text-2xl font-bold">채팅창</Heading>
        <Paragraph className="mt-2">
          텍스트 채팅은 회의 중 의사소통과 기록을 보조합니다. 입력창에서 메시지를 작성해 전송하면
          타임라인에 즉시 반영되며, 시스템 이벤트(입/퇴장, 녹화/회의록 시작/종료 등)도 함께 표시됩니다.
          검색/필터, 파일 첨부, 멘션/이모지 같은 확장도 고려된 구조입니다.
        </Paragraph>
        <ul className="mt-3 list-disc list-inside space-y-1 text-[15px]">
          <li>메시지 입력/전송, 시스템 로그 병행 표시</li>
          <li>필요 시 메시지를 회의록에 인용(향후 연결 기능 확장 시)</li>
          <li>채팅은 모달로 열리고, 애니메이션으로 표시/숨김 처리</li>
        </ul>
        <Figure
          src={meeting3}
          alt="채팅창"
          caption="채팅 — 메시지/시스템 이벤트 로그, 검색/필터/첨부까지 고려한 레이아웃"
        />

        <Separator className="my-10" />

        
        <Heading level={2} className="text-2xl font-bold">부가 기능</Heading>
        <ul className="mt-3 list-disc list-inside space-y-2 text-[15px]">
          <li>
            <b>앱/인스턴스 관리</b>: 앱 생성·선택 모달(제목/타입/리스트), 인스턴스 관리(이름 변경/삭제),
            삭제 확인, 성공 알림, <b>열린 인스턴스 삭제 금지</b> 경고 등 전체 플로우 제공.
          </li>
          <li>
            <b>옵션(설정)</b>: 오디오 입력/출력 장치 선택, 입력/출력 볼륨, 마이크/헤드셋 음소거 토글,
            새 메시지/입퇴장 알림 설정.
          </li>
          <li>
            <b>프로필/사용자 상세</b>: 내 프로필은 로컬스토리지에 저장/불러오기, 편집/상태변경 지원.
            사용자 상세는 기본값/props로 정보 표시.
          </li>
          <li>
            <b>알림</b>: 상단 슬라이드 토스트로 주요 상태를 몇 초간 노출.
          </li>
        </ul>
      </>
    ),
  },
} as const;

export default function DocsDetail() {
  const { slug } = useParams();
  const doc = slug ? (PAGES as any)[slug] : null;

  if (!doc) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Heading level={2}>문서를 찾을 수 없습니다.</Heading>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Heading level={1} className="text-3xl font-bold">{doc.title}</Heading>
      <Paragraph className="text-muted-foreground mt-2">{doc.desc}</Paragraph>
      <Separator className="my-6" />
      <div className="leading-relaxed text-[15px]">{doc.body}</div>
    </div>
  );
}
