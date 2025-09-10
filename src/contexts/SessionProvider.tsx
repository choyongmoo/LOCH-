import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { getSession, onAuthStateChange } from "../services/auth";
import { SessionContext } from "./SessionContext";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      const currentSession = await getSession();
      if (controller.signal.aborted) return;
      setSession(currentSession);
      setInitialized(true);
    })();

    const unsubscribe = onAuthStateChange((_, nextSession) => {
      if (controller.signal.aborted) return;
      setSession(nextSession);
    });

    return () => {
      controller.abort();
      unsubscribe();
    };
  }, []);

  return <SessionContext value={{ session, initialized }}>{children}</SessionContext>;
}
