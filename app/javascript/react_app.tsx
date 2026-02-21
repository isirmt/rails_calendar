import { createRoot } from "react-dom/client";
import EditorPage from "./pages/EditorPage";
import HomePage from "./pages/HomePage";

type Page = "home" | "editor";

type AppProps = {
  page: Page;
  calendarId: number | null;
};

function App({ page, calendarId }: AppProps) {
  if (page === "editor") {
    return <EditorPage calendarId={calendarId} onBackHome={() => window.location.assign("/")} />;
  }

  return <HomePage onGoEditor={(nextCalendarId) => window.location.assign(`/calendars/${nextCalendarId}/editor`)} />;
}

document.addEventListener("turbo:load", () => {
  const el = document.getElementById("root");
  if (!el) return;

  const pageData = el.dataset.page === "editor" ? "editor" : "home";
  const rawCalendarId = el.dataset.calendarId;
  const parsedCalendarId = rawCalendarId ? Number(rawCalendarId) : null;
  const calendarId = Number.isFinite(parsedCalendarId) ? parsedCalendarId : null;

  createRoot(el).render(<App page={pageData} calendarId={calendarId} />);
});
