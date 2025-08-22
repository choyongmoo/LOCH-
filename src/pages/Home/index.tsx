import { useEffect } from "react";
import { About } from "./About";
import { Tech } from "./Tech";
import { Team } from "./Team";
import { Footer } from "@/components/Home/Footer";
import { Button } from "@/components/common/ui/button";
import dashboardIllustration from "@/assets/landing/dashboard2.svg";

export const Home = () => {

  document.title = "LOCH";
  
  useEffect(() => {
  if (typeof window !== "undefined" && (window as any).__scrollTo) {
    const id = (window as any).__scrollTo;
    delete (window as any).__scrollTo;

    const scrollToElement = () => {
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -80; 
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      } else {
        console.warn(`🚨 ID '${id}'를 가진 요소를 찾을 수 없습니다.`);
      }
    };

   
    setTimeout(scrollToElement, 600);
  }
}, []);

  return (
    <>
      {/* 메인 히어로 섹션 */}
      <section className="relative w-full h-screen flex items-center transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 px-8 h-full place-items-center -translate-y-24">
          <div className="space-y-8">
            <span className="text-sm font-semibold tracking-wider Suppercase text-gray-500 dark:text-gray-400">
              협업 플랫폼
            </span>
            <h1 className="text-[60px] font-extrabold leading-[1.1] text-gray-900 dark:text-white">
              Streamline your workflow
            </h1>
            
            <div className="mt-10">
              <Button
                size="lg"
                className="px-10 py-6 text-lg bg-black text-white hover:bg-gray-900 rounded-xl shadow-md 
                dark:bg-white dark:text-black dark:hover:bg-gray-200 transition"
                asChild
              >
                <a href="/signup">지금 시작하기 →</a>
              </Button>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <img
              src={dashboardIllustration}
              alt="대시보드 UI"
              className="w-full max-w-md drop-shadow-lg dark:brightness-90"
            />
          </div>
        </div>
      </section>
      
      {/* 하위 섹션들 */}
      <About />
      <Tech />
      <Team />
      <Footer />
    </>
  );
};
