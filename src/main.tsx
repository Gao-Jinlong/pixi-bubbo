import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Bubbo from "./Bubbo.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Bubbo />
  </StrictMode>,
);
