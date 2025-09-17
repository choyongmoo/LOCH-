import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";
import { About } from "./About";
import { Tech } from "./Tech";
import { Team } from "./Team";
import { Footer } from "@/components/Home/Footer";
import { Button } from "@/components/common/ui/button";
import dashboardIllustration from "@/assets/landing/dashboard2.svg";

export const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "LOCH";

    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleStart = () => {
    if (loggedIn) {
      navigate("/workspace"); 
    } else {
      navigate("/signin"); 
    }
  };

  return (
    <>
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
                onClick={handleStart}
              >
                지금 시작하기 →
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
      
      <About />
      <Tech />
      <Team />
      <Footer />
    </>
  );
};
