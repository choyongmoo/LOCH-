import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";
import { About } from "./About";
import { Tech } from "./Tech";
import { Team } from "./Team";
import { Footer } from "@/components/Home/Footer";
import { Button } from "@/components/common/ui/button";
import dashboardIllustration from "@/assets/landing/undraw_video.svg";

import { consumeScrollRequest } from "@/lib/deferredScroll";

export const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "LOCH";
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
    const { data: authListener } = supabase.auth.onAuthStateChange((_e, s) =>
      setLoggedIn(!!s?.user)
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const targetId = consumeScrollRequest();
    if (!targetId) return;

    const yOffset = -80; 
    const tryScroll = (attempt = 0) => {
      const el = document.getElementById(targetId);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      } else if (attempt < 5) {
        requestAnimationFrame(() => tryScroll(attempt + 1));
      }
    };
    requestAnimationFrame(() => tryScroll(0));
  }, []);
  const handleStart = () => navigate(loggedIn ? "/workspace" : "/signin");

  return (
    <>
      <section className="relative w-full min-h-[88vh] pt-10 flex items-center transition-colors duration-300">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden />

        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 px-6 lg:px-8 place-items-center">
          <div className="min-w-0 space-y-7">
            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400">
              화상회의 플랫폼
            </span>

            <h1 className="font-extrabold leading-tight text-gray-900 dark:text-white text-[clamp(2rem,6vw,3.75rem)] break-keep">
              Streamline your workflow
            </h1>

            <div>
              <Button
                size="lg"
                className="px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg bg-black text-white hover:bg-gray-900 rounded-xl shadow-md 
                           dark:bg-white dark:text-black dark:hover:bg-gray-200 transition"
                onClick={handleStart}
              >
                지금 시작하기 →
              </Button>
            </div>
          </div>

          <div className="w-full max-w-md">
            <img
              src={dashboardIllustration}
              alt="대시보드 UI"
              className="w-full h-auto drop-shadow-lg dark:brightness-90 select-none"
              draggable={false}
            />
          </div>
        </div>
      </section>

      <About />
      <Tech />
      <Team />
      <Footer />
    </>
  );
};
