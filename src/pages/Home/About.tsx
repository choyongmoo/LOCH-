import groupVideo from "@/assets/landing/group_video.svg";
import chatAI from "@/assets/landing/chat_ai.svg";
import workspaceImg from "@/assets/landing/workspace.svg";
import chatting from "@/assets/landing/chatting.svg";

type FeatureCardProps = {
  image: string;
  title: string;
  description: string;
  accent: string;
};

const FeatureCard = ({ image, title, description, accent }: FeatureCardProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <div
          className="mx-auto w-[96%] rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-gray-200
                     dark:ring-gray-800 shadow-sm overflow-hidden"
        >
          <div className="h-[230px] px-8 py-6 flex items-center justify-center">
            <img
              src={image}
              alt={title}
              className="h-[170px] w-auto max-w-[90%] object-contain select-none pointer-events-none"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
        </div>
      </div>

      <div className="w-full mt-4 flex flex-col items-center text-center">
        <div className="mx-auto w-[72%] border-t border-gray-300 dark:border-gray-700 mb-3" />
        <p className="text-xs font-semibold tracking-wide text-emerald-600 dark:text-emerald-400">
          {accent}
        </p>

        <h3 className="mt-1 text-[17px] font-bold text-gray-900 dark:text-white truncate max-w-[260px]">
          {title}
        </h3>

        <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-[320px] lg:max-w-[300px]">
          {description}
        </p>
      </div>
    </div>
  );
};

export const About = () => {
  const features: FeatureCardProps[] = [
    {
      image: groupVideo,
      accent: "core feature 01",
      title: "화상·화면공유",
      description:
        "온라인에서 화상과 음성으로 회의를 진행하고, 화면 공유로 발표와 시연을 지원합니다.",
    },
    {
      image: chatAI,
      accent: "core feature 02",
      title: "AI 요약",
      description:
        "회의 내용을 AI가 자동 요약하여 핵심만 빠르게 파악하고 후속 업무에 활용합니다.",
    },
    {
      image: workspaceImg,
      accent: "core feature 03",
      title: "워크스페이스·인증",
      description:
        "로그인 기반 워크스페이스에서 회의 생성·참여·기록을 관리합니다. Supabase로 인증과 데이터 저장을 처리합니다.",
    },
    {
      image: chatting,
      accent: "core feature 04",
      title: "실시간 통신",
      description:
        "회의 중 메시지와 알림을 실시간으로 주고받아 원활한 협업을 돕습니다.",
    },
  ];

  return (
    <section
      id="about"
      className="w-full max-w-7xl mx-auto px-6 pt-24 pb-28 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300"
    >
      <div className="text-center mb-24">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">기능 소개</h2>
        <p className="text-gray-500 dark:text-gray-400 text-xl mt-4">
          프로젝트의 핵심 기능을 간단히 소개합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </div>

      <div className="w-full border-t border-gray-200 dark:border-gray-700 mt-48" />
    </section>
  );
};

export default About;
