import { SessionProvider } from "./SessionProvider";
import { ThemeProvider } from "./ThemeProvider";

export function GlobalProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
