import codeEditor from "@/assets/landing/undraw_report.svg";
import docCollab from "@/assets/landing/undraw_text-files.svg";
import designTool from "@/assets/landing/undraw_designer.svg";
import meetingTool from "@/assets/landing/undraw_team.svg";

interface FeatureCardProps {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
}

const FeatureCard = ({
  image,
  title,
  description,
  accent,
}: FeatureCardProps) => {
  return (
    <div className="flex flex-col items-center text-center gap-4 h-[420px]">
      <div className="rounded-2xl overflow-hidden shadow-md bg-white dark:bg-gray-900 p-6 transition-transform transform hover:scale-105">
        <img
          src={image}
          alt={title}
          className="w-[240px] h-[240px] object-contain"
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
      image: codeEditor,
      accent: "characteristic 01",
      title: "실시간 코드 편집",
      subtitle: "코드 협업",
      description:
        "여러 명이 동시에 코드 작업 가능하며 실시간 동기화와 Git 연동을 지원합니다.",
    },
    {
      image: docCollab,
      accent: "characteristic 02",
      title: "문서 공동 작업",
      subtitle: "문서 협업",
      description:
        "기획서, 회의록 등을 함께 작성할 수 있는 실시간 문서 에디터를 제공합니다.",
    },
    {
      image: designTool,
      accent: "characteristic 03",
      title: "디자인 협업",
      subtitle: "UI·UX 공유",
      description:
        "개발자와 디자이너가 함께 피드백을 주고받으며 디자인을 빠르게 개선할 수 있습니다.",
    },
    {
      image: meetingTool,
      accent: "characteristic 04",
      title: "팀 회의 & 메모",
      subtitle: "회의 협업",
      description:
        "회의록 자동 저장, 메모 기능, 일정 관리까지 하나의 플랫폼에서 간편하게 처리하세요.",
    },
  ];

  return (
   <section
      id="about"
      className="w-full max-w-7xl mx-auto px-6 pt-24 pb-28 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300"
    >
       
      <div className="text-center mb-24">
        <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
          주요 기능
        </p>
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
        쉽고 빠른 목표 설계가<br />
        가능한 <span className="text-primary">어플리케이션</span>
      </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {features.map((item, idx) => (
          <FeatureCard key={idx} {...item} />
        ))}
      </div>

       <div className="w-full border-t border-gray-200 dark:border-gray-700 mt-48" />
    </section>
  );
};
