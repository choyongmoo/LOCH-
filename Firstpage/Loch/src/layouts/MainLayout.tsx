import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

const MainLayout = () => {
  return (
    <div className="pt-[64px]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
