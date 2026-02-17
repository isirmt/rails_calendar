import React from "react";
import { createRoot } from "react-dom/client";

console.log("react_app.tsx loaded");

function App() {
  return (
    <React.Fragment>
      <h1 className="text-3xl font-bold text-blue-600">Hello React + TypeScript (Rails) + Tailwind CSS</h1>
    </React.Fragment>
  );
}

document.addEventListener("turbo:load", () => {
  const el = document.getElementById("root");
  if (!el) return;
  createRoot(el).render(<App />);
});