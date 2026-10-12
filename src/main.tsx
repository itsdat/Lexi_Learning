import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client.ts";
import { GooeyToaster } from "@/components/ui/goey-toaster";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <GooeyToaster position="top-center" closeButton="top-left" />
    </QueryClientProvider>
  </StrictMode>,
);
