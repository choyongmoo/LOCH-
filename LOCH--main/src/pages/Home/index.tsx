import { Button } from "@/components/common/ui/button";
import { Link } from "react-router";
import dashboardIllustration from "@/assets/dashboard.svg";
import { FeatureSection } from "@/components/Home/FeatureSection";
import { Footer } from "@/components/Home/Footer";

export const Home = () => {
  return (
    <>
      {/* 메인 히어로 섹션 */}
      <section className="relative w-full py-32 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 px-8 items-center">
          
          {/* 왼쪽 텍스트 영역 */}
          <div className="space-y-8">
            <span className="text-sm font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400">
              TEAMWORK MADE SIMPLE
            </span>

            <h1 className="text-[60px] font-extrabold leading-[1.1] text-gray-900 dark:text-white">
              Streamline your workflow <br />
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
              코드 편집, 문서 작성, 디자인까지—모든 팀원이 한 공간에서 실시간으로 협업할 수 있어요.
              따로따로 툴을 바꿀 필요 없이, 함께 만들어보세요.
            </p>

            <div className="mt-10">
              <Button
                size="lg"
                className="px-10 py-6 text-lg bg-black text-white hover:bg-gray-900 rounded-xl shadow-md 
                          dark:bg-white dark:text-black dark:hover:bg-gray-200 transition"
                asChild
              >
                <Link to="/signup">지금 시작하기 →</Link>
              </Button>
            </div>
          </div>

          {/* 오른쪽 이미지 */}
          <div className="flex justify-center items-center">
            <img
              src={dashboardIllustration}
              alt="대시보드 UI"
              className="w-full max-w-md drop-shadow-lg dark:brightness-90"
            />
          </div>
        </div>
      </section>

      {/* 경계선만 추가 */}
      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {/* FeatureSection */}
      <section className="py-24 transition-colors duration-300">
        <FeatureSection />
      </section>

      <Footer />
    </>
  );
};
