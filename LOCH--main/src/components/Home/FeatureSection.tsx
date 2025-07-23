import codeEditor from "@/assets/undraw_report.svg";
import docCollab from "@/assets/undraw_text-files.svg";
import designTool from "@/assets/undraw_designer.svg";
import meetingTool from "@/assets/undraw_team.svg";
import { Button } from "@/components/common/ui/button";

interface FeatureItemProps {
  image: string;
  title: string;
  description: string;
}

const FeatureItem = ({ image, title, description }: FeatureItemProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all p-10 flex flex-col items-center text-center w-full max-w-xl mx-auto">
      
      {/*이미지 영역 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-10 flex justify-center items-center w-full h-64">
        <img src={image} alt={title} className="w-72 h-56 object-contain" />
      </div>

      {/*제목 */}
      <h3 className="mt-8 text-3xl font-bold text-gray-900 dark:text-white">
        {title}
      </h3>

      {/* 설명 */}
      <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-lg">
        {description}
      </p>

      {/* 버튼 */}
      <div className="mt-6">
        <Button className="px-8 py-4 text-lg rounded-lg shadow-sm">
          자세히 알아보기 →
        </Button>
      </div>
    </div>
  );
};

export const FeatureSection = () => {
  const features = [
    {
      image: codeEditor,
      title: "실시간 코드 편집",
      description:
        "팀원들과 동시에 코드를 작성하고 수정할 수 있는 실시간 협업 코드 에디터를 제공합니다."
    },
    {
      image: docCollab,
      title: "문서 공동 작업",
      description:
        "프로젝트 문서와 기획서를 한 공간에서 공유하고 함께 작성할 수 있어 더 효율적인 협업이 가능합니다."
    },
    {
      image: designTool,
      title: "디자인 협업",
      description:
        "디자이너와 개발자가 실시간으로 피드백을 주고받으며 UI·UX를 빠르게 개선할 수 있습니다."
    },
    {
      image: meetingTool,
      title: "팀 회의 & 메모",
      description:
        "회의록 자동 저장, 메모 기능, 일정 관리까지 하나의 플랫폼에서 간편하게 처리하세요."
    }
  ];

  return (
    <section className="container mx-auto py-24">
      {/* 상단 제목 */}
      <div className="text-center mb-20">
        <h2 className="text-5xl font-bold text-gray-900 dark:text-white">
          협업을 더 간편하게
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-xl mt-4">
          팀의 생산성을 높이는 통합 협업 기능
        </p>
      </div>

      {/* 카드 4개, 더 넓은 가로폭 + 간격 확대 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        {features.map((feature, idx) => (
          <FeatureItem key={idx} {...feature} />
        ))}
      </div>
    </section>
  );
};
