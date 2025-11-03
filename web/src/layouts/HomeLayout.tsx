import { Header } from "@/components/Home/Header";
import { Navbar } from "@/components/Home/Navbar";
import { Outlet } from "react-router";

export const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/80">

      <div className="fixed top-0 w-full pointer-events-none z-30">
        <div className="pointer-events-auto">
          <Header />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="p-8 pt-10 relative z-50">
          <Navbar />
        </div>

        <div className="w-full max-w-6xl flex-grow px-4 md:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
