import type { Session } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

export type SessionContextValue = {
  session: Session | null;
  initialized: boolean;
};

export const SessionContext = createContext<SessionContextValue>({
  session: null,
  initialized: false,
});

export function useSession() {
  return useContext(SessionContext);
}
