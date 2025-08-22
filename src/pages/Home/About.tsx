const meetingTool = `data:image/svg+xml;utf8,
<svg width='240' height='240' viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg' shape-rendering='geometricPrecision'>
  <g fill='none' stroke='%231f2937' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' vector-effect='non-scaling-stroke'>
    <rect x='24' y='24' width='192' height='144' rx='12'/>
    <line x1='120' y1='24' x2='120' y2='168'/>
    <line x1='24' y1='96' x2='216' y2='96'/>
    <rect x='92' y='180' width='56' height='8' rx='4' fill='%231f2937' opacity='0.15' stroke='none'/>
  </g>
</svg>`;


const docCollab = `data:image/svg+xml;utf8,
<svg width='240' height='240' viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg' shape-rendering='geometricPrecision'>
  <defs>
    <style>
      .ink{stroke:%231f2937;stroke-width:6;fill:none;stroke-linecap:round;stroke-linejoin:round}
    </style>
  </defs>
  <!-- 중앙 사용자 -->
  <circle cx='120' cy='92' r='22' class='ink'/>
  <path d='M92 146c8-16 24-24 28-24h28c4 0 20 8 28 24' class='ink'/>
  <!-- 좌측 사용자 -->
  <circle cx='72' cy='108' r='16' class='ink'/>
  <path d='M52 146c6-12 16-18 20-18h16' class='ink'/>
  <!-- 우측 사용자 -->
  <circle cx='168' cy='108' r='16' class='ink'/>
  <path d='M188 146c-6-12-16-18-20-18h-16' class='ink'/>
  <!-- 역할/상세 배지 -->
  <rect x='92' y='32' width='56' height='20' rx='10' fill='%236366f1' opacity='0.15'/>
  <line x1='100' y1='42' x2='140' y2='42' stroke='%236366f1' stroke-width='6' stroke-linecap='round'/>
</svg>`;

const codeEditor = `data:image/svg+xml;utf8,
<svg width='240' height='240' viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg' shape-rendering='geometricPrecision'>
  <g fill='none' stroke='%231f2937' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' vector-effect='non-scaling-stroke'>
    <rect x='48' y='36' width='120' height='168' rx='12'/>
    <line x1='64' y1='78' x2='152' y2='78'/>
    <line x1='64' y1='106' x2='144' y2='106' opacity='0.85'/>
    <line x1='64' y1='134' x2='128' y2='134' opacity='0.7'/>
  </g>
  <circle cx='168' cy='92' r='22' fill='none' stroke='%2310b981' stroke-width='6'/>
  <path d='M158 92l6 6 12-12' fill='none' stroke='%2310b981' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/>
</svg>`;

const designTool = `data:image/svg+xml;utf8,
<svg width='240' height='240' viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg' shape-rendering='geometricPrecision'>
  <!-- 말풍선 본체 -->
  <path d='M60 90h120a16 16 0 0 1 16 16v30a16 16 0 0 1-16 16H112l-22 18v-18H76A16 16 0 0 1 60 136v-30a16 16 0 0 1 16-16Z'
        fill='none' stroke='%231f2937' stroke-width='6' stroke-linejoin='round'/>
  <!-- 타이핑 점 -->
  <circle cx='102' cy='121' r='5' fill='%231f2937'/>
  <circle cx='120' cy='121' r='5' fill='%236366f1'/>
  <circle cx='138' cy='121' r='5' fill='%231f2937'/>
</svg>`;

interface FeatureCardProps {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
}

const FeatureCard = ({ image, title, description, accent }: FeatureCardProps) => {
  return (
    <div className="flex flex-col items-center text-center gap-4 h-[420px]">
      <div className="rounded-2xl overflow-hidden shadow-md bg-white dark:bg-gray-900 p-6 transition-transform transform hover:scale-105">
        <img
          src={image}
          alt={title}
          className="w-[240px] h-[240px] object-contain"
          loading="eager"
          decoding="sync"
        />
      </div>
      <div className="border-t border-gray-400 dark:border-gray-500 w-3/4 pt-4">
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          {accent}
        </p>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mt-1">
          {description}
        </p>
      </div>
    </div>
  );
};

export const About = () => {
  const features = [
    {
      image: meetingTool,
      accent: "meeting feature 01",
      title: "분할 보드 · 화면공유",
      subtitle: "2×2 그리드",
      description:
        "패널을 드래그해 배치·교체·분할하고, 화면공유와 전체화면을 지원합니다.",
    },
    {
      image: docCollab,
      accent: "meeting feature 02",
      title: "참가자 · 상세정보",
      subtitle: "멤버/상세",
      description:
        "참가자 목록과 역할을 관리하며, 상세정보에서 메타·진행·요약을 확인합니다.",
    },
    {
      image: codeEditor,
      accent: "meeting feature 03",
      title: "자동 회의록",
      subtitle: "STT/요약/내보내기",
      description:
        "실시간 자막을 병합해 요약을 만들고, 회의록을 문서로 바로 내보냅니다.",
    },
    {
   
      image: designTool,
      accent: "meeting feature 04",
      title: "실시간 채팅",
      subtitle: "검색/로그",
      description:
        "메시지와 시스템 이벤트를 기록하고, 검색·필터로 대화를 빠르게 찾습니다.",
    },
  ];

  return (
    <section
      id="about"
      className="w-full max-w-7xl mx-auto px-6 pt-24 pb-28 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300"
    >
      <div className="text-center mb-24">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          기능 소개
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-xl mt-4">
          프로젝트의 핵심 기능을 간단히 소개합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {features.map((item, idx) => (
          <FeatureCard key={idx} {...(item as any)} />
        ))}
      </div>

      <div className="w-full border-t border-gray-200 dark:border-gray-700 mt-48" />
    </section>
  );
};
