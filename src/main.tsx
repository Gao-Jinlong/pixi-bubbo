import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Bubbo from "./Bubbo.tsx";
import { BrowserRouter, Routes, Route } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Bubbo />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
