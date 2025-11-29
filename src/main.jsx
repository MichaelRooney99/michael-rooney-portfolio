import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./kiosk.css";
import KioskUI from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <KioskUI />
  </StrictMode>
);
