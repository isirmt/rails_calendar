import React from "react";
import { createRoot } from "react-dom/client";

console.log("react_app.tsx loaded");

function App() {
  return <h1>Hello React + TypeScript (Rails)</h1>;
}

document.addEventListener("turbo:load", () => {
  const el = document.getElementById("root");
  if (!el) return;
  createRoot(el).render(<App />);
});