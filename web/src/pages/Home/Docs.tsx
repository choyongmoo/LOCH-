import { useEffect, useState } from "react";
import { Heading } from "@/components/common/ui/Heading";
import { Paragraph } from "@/components/common/ui/Paragraph";
import { Separator } from "@/components/common/ui/separator";
import { ChevronUp } from "lucide-react";
import meeting1 from "@/assets/landing/meeting1.png";
import meeting2 from "@/assets/landing/meeting2.png";
import meeting3 from "@/assets/landing/meeting3.png";
import meeting4 from "@/assets/landing/meeting4.png";
import meeting5 from "@/assets/landing/meeting5.png";

function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="mt-4 rounded-xl border bg-card p-4 shadow-sm">
      <img src={src} alt={alt} className="w-full rounded-lg dark:brightness-90" />
      {caption && <figcaption className="mt-3 text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

const SECTIONS = [
  {
    id: "workspace",
    title: "워크스페이스 홈",
    desc:
      "협업을 시작하는 첫 화면입니다. 왼쪽 메뉴에서 홈·프로필·카메라 테스트·개인 연락처·서버 관리를 이동하고, 오른쪽 카드에서 서버 정보·친구·빠른 회의 시작을 확인할 수 있습니다.",
    body: (
      <>
        <Paragraph>
          로그인 후 보이는 화면이에요. 여기서 회의를 만들거나 참여하고, 장치를 미리 점검할 수 있습니다.
          자주 쓰는 기능만 간단히 기억해 두면 좋아요.
        </Paragraph>
        <ul className="mt-3 list-disc list-inside text-[15px] space-y-1">
          <li><b>회의 시작</b> 버튼으로 바로 새 회의를 열 수 있습니다.</li>
          <li><b>서버 카드</b>에서는 진행 중인 서버(프로젝트)와 호스트, 참가자 수, 소개 문구를 확인합니다.</li>
          <li><b>친구 목록</b>은 함께 회의할 사람들을 관리하는 곳입니다.</li>
          <li><b>장치 테스트</b>에서 카메라·마이크가 정상인지 미리 확인하세요.</li>
        </ul>
        <Figure
          src={meeting1}
          alt="워크스페이스 홈"
          caption="워크스페이스 홈 — 회의 시작, 서버·친구 현황, 장치 테스트를 한눈에 볼 수 있습니다."
        />
      </>
    ),
  },
  {
    id: "meeting",
    title: "회의 화면 (컨트롤바)",
    desc:
      "화상 회의가 실제로 진행되는 화면입니다. 아래쪽 컨트롤바에서 마이크·카메라·화면 공유·채팅·설정·나가기를 조작합니다.",
    body: (
      <>
        <Paragraph>
          회의에 입장하면 중앙에는 영상(또는 프로필)이 보이고, 맨 아래에 조작 버튼이 모여 있습니다.
          필요한 기능은 대부분 아래쪽에서 한 번에 켜고 끌 수 있어요.
        </Paragraph>
        <ul className="mt-3 list-disc list-inside text-[15px] space-y-1">
          <li><b>마이크 / 카메라</b>: 버튼을 눌러 켜고 끕니다. 작은 화살표가 보이면 장치를 바꿀 수 있습니다.</li>
          <li><b>화면 공유</b>: 내 화면·창·브라우저 탭 중 하나를 선택해 공유합니다.</li>
          <li><b>채팅</b>: 대화 내용을 문자로 주고받고, 시스템 안내(입·퇴장, 공유 시작 등)도 함께 확인합니다.</li>
          <li><b>설정</b>: 회의 중에도 장치와 배경, 마이크 음량을 바로 바꿀 수 있습니다.</li>
          <li><b>나가기</b>: 회의를 종료하거나 방에서 나옵니다.</li>
        </ul>
        <Paragraph className="mt-3">
          네트워크가 잠시 불안정하면 화면 오른쪽 위에 연결 상태 안내가 표시됩니다.
          녹화가 켜지면 화면 가장자리가 빨간색으로 표시되어 쉽게 알아볼 수 있어요.
        </Paragraph>
        <Figure
          src={meeting2}
          alt="회의 메인 화면"
          caption="회의 화면 — 아래 컨트롤바로 모든 주요 기능을 빠르게 조작합니다."
        />
      </>
    ),
  },
  {
    id: "chat",
    title: "채팅 (오른쪽 패널)",
    desc:
      "회의 중에 글로 대화할 수 있는 공간입니다. 오른쪽에서 열리고, 메시지와 시스템 알림이 시간 순서대로 표시됩니다.",
    body: (
      <>
        <Paragraph>
          마이크가 꺼져 있거나 중요한 링크·메모를 남길 때 채팅을 활용하세요.
          새 메시지가 오면 알림 배지가 표시되어 놓치지 않게 도와줍니다.
        </Paragraph>
        <ul className="mt-3 list-disc list-inside text-[15px] space-y-1">
          <li>텍스트 입력 후 <b>전송</b> 버튼을 누르면 메시지가 올라갑니다.</li>
          <li>회의에 누가 들어오거나 나가면, <b>시스템 알림</b>이 함께 기록됩니다.</li>
          <li>패널을 닫아도 새 메시지가 오면 알림으로 알려줍니다.</li>
        </ul>
        <Figure
          src={meeting3}
          alt="채팅 패널"
          caption="채팅 — 말하기 어려운 상황에서도 메시지로 빠르게 소통할 수 있습니다."
        />
      </>
    ),
  },
  {
    id: "settings",
    title: "설정 (장치 · 배경 · 마이크 음량)",
    desc:
      "카메라·마이크·스피커를 선택하고, 배경 효과와 마이크 음량을 조절합니다. 회의 중에도 바로 바꿀 수 있습니다.",
    body: (
      <>
        <Paragraph>
          화질이나 소리가 원하는 대로 나오지 않으면 설정에서 간단히 조정하세요.
        </Paragraph>
        <ul className="mt-3 list-disc list-inside text-[15px] space-y-1">
          <li><b>카메라</b>: 사용할 카메라를 고르고, 배경을 <b>없음</b> 또는 <b>흐리게</b>로 설정합니다.</li>
          <li><b>마이크</b>: 마이크 선택과 <b>음소거</b>, <b>음량 조절</b>이 가능합니다.</li>
          <li><b>스피커/헤드폰</b>: 소리를 들을 장치를 선택합니다.</li>
        </ul>
        <Figure
          src={meeting4}
          alt="설정(장치/배경/마이크)"
          caption="설정 — 카메라·마이크·스피커를 고르고, 배경과 마이크 음량을 조절합니다."
        />
      </>
    ),
  },
  {
    id: "history",
    title: "회의 내역 · 요약/전사",
    desc:
      "회의가 끝나면 ‘회의 내역’에서 요약본과 대화 기록을 확인할 수 있습니다. 필요한 내용은 파일로 저장하세요.",
    body: (
      <>
        <Paragraph>
          회의가 종료되면 대화가 자동으로 정리됩니다. 전체 내용을 한눈에 볼 수 있는 <b>요약본</b>,
          시간과 발화자가 함께 기록된 <b>대화 기록</b>, 특정 구간만 추려 보는 <b>부분 요약</b>을 제공합니다.
        </Paragraph>
        <ul className="mt-3 list-disc list-inside text-[15px] space-y-2">
          <li><b>요약본</b>: 회의 핵심만 빠르게 확인하고 파일로 저장할 수 있습니다.</li>
          <li><b>대화 기록</b>: 누가 언제 무엇을 말했는지 시간 순서대로 확인합니다.</li>
          <li><b>부분 요약</b>: 필요한 구간만 골라 간단히 정리합니다.</li>
        </ul>
        <Figure
          src={meeting5}
          alt="회의 내역"
          caption="회의 내역 — 요약·대화 기록·부분 요약을 제공하며, 원하는 항목을 파일로 저장할 수 있습니다."
        />
      </>
    ),
  },
] as const;

function ProgressToTop() {
  const [show, setShow] = useState(false);
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? Math.min(100, Math.round((scrolled / max) * 100)) : 0;
      setPct(p);
      setShow(scrolled > 320);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const radius = 16;
  const C = 2 * Math.PI * radius;
  const offset = C * (1 - pct / 100);
  if (!show) return null;
  return (
    <button
      aria-label="맨 위로"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group fixed right-4 bottom-6 xl:right-8 xl:bottom-8 z-40 h-12 w-12 rounded-full border bg-background/90 backdrop-blur shadow-md hover:shadow-lg transition grid place-items-center"
    >
      <svg width="40" height="40" viewBox="0 0 40 40" className="absolute">
        <circle cx="20" cy="20" r={radius} className="stroke-muted" strokeWidth="3" fill="none" />
        <circle
          cx="20"
          cy="20"
          r={radius}
          className="stroke-foreground"
          strokeWidth="3"
          fill="none"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 120ms linear" }}
        />
      </svg>
      <ChevronUp className="relative h-5 w-5" />
      <span className="sr-only">Back to top</span>
    </button>
  );
}

export default function Docs() {
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev;
    };
  }, []);
  return (
    <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 py-16">
      <main>
        <Heading level={1} className="text-3xl font-extrabold">
          화상회의 설명서
        </Heading>
        <div className="mt-6 rounded-xl border bg-card p-4">
          <p className="text-sm font-medium mb-2">목차</p>
          <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="hover:text-foreground underline-offset-2 hover:underline"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <Separator className="my-8" />
        <div className="leading-relaxed text-[15px]">
          {SECTIONS.map((s, idx) => (
            <section id={s.id} key={s.id} className={`scroll-mt-24 ${idx > 0 ? "pt-8" : ""}`}>
              <Heading level={2} className="text-2xl font-bold">
                {s.title}
              </Heading>
              <Paragraph className="mt-2">{s.desc}</Paragraph>
              <div className="mt-4">{s.body}</div>
              {idx < SECTIONS.length - 1 && <Separator className="my-10" />}
            </section>
          ))}
        </div>
      </main>
      <ProgressToTop />
    </div>
  );
}
