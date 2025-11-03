import "@livekit/components-styles";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import { Router } from "./router.tsx";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <Router />
  </ThemeProvider>
);
