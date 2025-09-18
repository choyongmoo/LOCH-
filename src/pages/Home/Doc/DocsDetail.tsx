import { Heading } from "@/components/common/ui/Heading";
import { Paragraph } from "@/components/common/ui/Paragraph";
import { Separator } from "@/components/common/ui/separator";

import meeting1 from "@/assets/landing/meeting1.png";
import meeting2 from "@/assets/landing/meeting2.png";
import meeting3 from "@/assets/landing/meeting3.png";
import meeting4 from "@/assets/landing/meeting4.png";
import meeting5 from "@/assets/landing/meeting5.png";

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
const SECTIONS = [
  {
    id: "meeting",
    title: "회의 기본 화면",
    desc:
      "좌측 컨트롤 바 · 중앙 스테이지 · 우측 참가자 패널 구성. 중앙에서 카메라/화면공유를 시작하고, 우측에서 참가자·회의방 상세정보를 확인합니다.",
    body: (
      <>
        <Paragraph>
          현재 버전은 <b>패널 드래그&드롭·P/S/N/C 사이드바</b>를 사용하지 않습니다.
          중앙 스테이지에서 <b>카메라 시작</b> 또는 <b>화면 공유 시작</b>으로 미디어를 켜고,
          좌측 컨트롤 바에서 <b>마이크·헤드셋 음소거</b>, <b>설정(옵션)</b>, <b>OUT(나가기)</b>를 즉시 제어합니다.
        </Paragraph>

        <ul className="mt-3 list-disc list-inside text-[15px] space-y-1">
          <li><b>좌측 컨트롤 바</b>: 마이크 · 헤드셋 · 화면공유 · 설정(⚙️) · 나가기</li>
          <li><b>중앙 스테이지</b>: 내 프로필/이니셜 표시, ‘카메라 시작’·‘화면 공유 시작’ 버튼</li>
          <li><b>우측 참가자 패널</b>: 참가자 상태 표시, 하단의 <b>회의방 상세정보</b> 버튼</li>
          <li><b>채팅</b>: 우하단에서 열리는 플로팅 창(열기/닫기 가능)</li>
        </ul>

        <Figure
          src={meeting1}
          alt="회의 기본 화면"
          caption="좌측 컨트롤 바, 중앙 스테이지(카메라/화면공유 시작), 우측 참가자 패널과 ‘회의방 상세정보’ 버튼"
        />
      </>
    ),
  },
  {
    id: "details",
    title: "회의방 상세정보",
    desc:
      "우상단 멤버 바에서 ‘회의방 상세정보’ 버튼을 눌러 모달을 엽니다. 회의 메타데이터, 상태, 참가자 규모, 시간 지표, 회의록 진행 현황을 한눈에 확인할 수 있습니다.",
    body: (
      <>
        <Paragraph>
          상세정보 모달에서는 회의의 전반적인 상황을 집중적으로 보여줍니다. 
          현재 진행 상태, 회의 설명, 참가자 리스트, 자동 회의록/요약 진행 현황 등을 
          카드 UI로 구성해 직관적으로 확인할 수 있습니다. 
        </Paragraph>

        <ul className="mt-3 list-disc list-inside space-y-1 text-[15px]">
          <li>제목/설명/상태, 참가자 규모, 현재 시간 등 핵심 메타데이터 표시</li>
          <li>자동 회의록 활성화 시 요약·내보내기 진행 상황 확인</li>
        </ul>

        <Figure
          src={meeting2}
          alt="회의방 상세정보"
          caption="회의방 상세정보 — 메타데이터, 참가자, 회의록 현황을 모아 보여주는 모달"
        />
      </>
    ),
  },
  {
    id: "chat",
    title: "채팅",
    desc:
      "회의 중 텍스트 채팅을 통해 실시간 의사소통과 기록을 보조합니다. 우하단 버튼으로 열리는 플로팅 창 형태이며, 메시지와 시스템 이벤트 로그를 함께 표시합니다.",
    body: (
      <>
        <Paragraph>
          채팅창은 독립된 <b>플로팅 모달</b>로 열리고 닫을 수 있습니다. 
          참가자가 보낸 메시지와 더불어, <b>입/퇴장</b>, <b>화면 공유</b>, 
          <b>회의록 시작/종료</b> 같은 시스템 이벤트도 동일한 타임라인에 출력됩니다. 
          검색과 필터, 파일 첨부, 멘션 및 이모지 확장까지 고려된 구조로 확장성을 갖췄습니다.
        </Paragraph>

        <ul className="mt-3 list-disc list-inside space-y-1 text-[15px]">
          <li>실시간 메시지 입력 및 전송</li>
          <li>시스템 이벤트 로그(입/퇴장, 화면공유, 회의록 시작/종료 등) 병행 표시</li>
          <li>검색/필터, 파일 첨부, 멘션/이모지 확장 가능</li>
          <li>우하단에서 열고 닫는 <b>모달/플로팅 채팅창</b> 형태</li>
        </ul>

        <Figure
          src={meeting3}
          alt="채팅창"
          caption="채팅 — 실시간 메시지와 시스템 이벤트 로그가 함께 표시되는 플로팅 창"
        />
      </>
    ),
  },
  {
    id: "options",
    title: "옵션 · 장치 설정",
    desc:
      "회의 중 오디오 장치와 볼륨을 세밀하게 제어하고, 알림 여부를 설정할 수 있습니다.",
    body: (
      <>
        <Paragraph>
          옵션 모달에서는 <b>오디오 입력/출력 장치</b>를 선택하고, 
          <b>입력/출력 볼륨</b>을 조절하거나 <b>마이크·헤드셋 음소거</b>를 개별 제어할 수 있습니다. 
        </Paragraph>

        <ul className="mt-3 list-disc list-inside text-[15px] space-y-1">
          <li>오디오 입력/출력 장치 선택</li>
          <li>입력/출력 볼륨 조절</li>
          <li>마이크/헤드셋 음소거 토글</li>
        </ul>

        <Figure
          src={meeting4}
          alt="옵션 모달"
          caption="옵션 — 오디오 장치 선택, 볼륨 조절, 음소거 및 알림 설정"
        />
      </>
    ),
  },
  {
    id: "profile",
    title: "프로필 / 사용자 상세",
    desc:
      "내 프로필을 확인하고, 다른 참가자의 역할/부서/연락처/스킬/프로젝트 상세를 확인할 수 있습니다.",
    body: (
      <>
        <Paragraph>
          <b>사용자 상세</b>는 멤버 아바타를 클릭해 열리며, 해당 사용자의 역할, 부서, 이메일, 스킬, 프로젝트 정보를 제공합니다.
        </Paragraph>

        <ul className="mt-3 list-disc list-inside text-[15px] space-y-1">
          <li>내 프로필: 이름/상태 </li>
          <li>사용자 상세: 역할, 부서, 이메일, 스킬, 프로젝트 확인</li>
        </ul>

        <Figure
          src={meeting5}
          alt="프로필 및 사용자 상세"
          caption="프로필/사용자 상세 — 내 프로필 편집 및 저장, 아바타 클릭 시 사용자 상세 모달 표시"
        />
      </>
    ),
  },
  {
    id: "extra",
    title: "부가 기능",
    desc:
      "앱/인스턴스 관리, 경고/확인 모달, 알림 토스트 등 회의 흐름을 보조하는 다양한 부가 기능을 제공합니다.",
    body: (
      <>
        <Paragraph>
          회의 화면을 보조하기 위해 여러 가지 모달과 알림 기능이 제공됩니다. 
          <b>앱/인스턴스 관리</b>에서는 생성, 이름 변경, 삭제를 수행할 수 있고,
          삭제 시 <b>확인 모달</b>과 <b>열린 인스턴스 삭제 금지 경고</b>가 표시됩니다. 
          또한 작업 성공/실패에 따라 <b>성공 모달</b>이나 <b>에러 알림</b>이 나타나며,
          상단에서는 몇 초간 유지되는 <b>슬라이드 토스트 알림</b>을 통해 주요 상태를 확인할 수 있습니다.
        </Paragraph>

        <ul className="mt-3 list-disc list-inside text-[15px] space-y-2">
          <li>앱/인스턴스 관리: 생성 · 이름 변경 · 삭제</li>
          <li>삭제 시 확인 모달, 열린 인스턴스 삭제 금지 경고</li>
          <li>성공/에러 모달 표시</li>
          <li>상단 슬라이드 토스트 알림</li>
          <li>회의 종료 시 <b>나가기 확인</b> 모달</li>
        </ul>
      </>
    ),
  },
] as const;

export default function DocsDetail() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* 문서 타이틀 */}
      <Heading level={1} className="text-3xl font-extrabold">
        화상회의 설명서
      </Heading>
      <Paragraph className="text-muted-foreground mt-2">
        회의 화면/상세정보/채팅/옵션/프로필/부가 기능을 한 문서에서 확인하세요.
      </Paragraph>

      {/* 목차(TOC) */}
      <div className="mt-6 rounded-xl border bg-card p-4">
        <p className="text-sm font-medium mb-2">목차</p>
        <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="hover:text-foreground underline-offset-2 hover:underline"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <Separator className="my-8" />

      {/* 섹션 렌더링 */}
      <div className="leading-relaxed text-[15px]">
        {SECTIONS.map((s, idx) => (
          <section id={s.id} key={s.id} className={idx > 0 ? "pt-8" : ""}>
            <Heading level={2} className="text-2xl font-bold">
              {s.title}
            </Heading>
            <Paragraph className="mt-2">{s.desc}</Paragraph>
            <div className="mt-4">{s.body}</div>
            {idx < SECTIONS.length - 1 && <Separator className="my-10" />}
          </section>
        ))}
      </div>
    </div>
  );
}
