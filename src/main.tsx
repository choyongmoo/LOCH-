import "@livekit/components-styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { GlobalProviders } from "./contexts/GlobalProviders";
import Router from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalProviders>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </GlobalProviders>
  </StrictMode>
);
