import { Logo } from "@/components/common/Logo";
import { Outlet } from "react-router";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/60">
      <header className="p-8 z-10 absolute">
        <Logo />
      </header>
      <main className="flex items-center justify-center absolute inset-0">
        <Outlet />
      </main>
    </div>
  );
};
