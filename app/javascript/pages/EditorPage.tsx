import React, { useEffect, useMemo, useState } from "react";

type EditorPageProps = {
  calendarId: number | null;
  onBackHome: () => void;
};

type CalendarSummary = {
  id: number;
  name: string;
  year: number;
  month: number;
};

const WEEK_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

// グリッド用のセルの割り当て
function buildMonthCells(year: number, month: number): Array<number | null> {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: Array<number | null> = [];

  for (let i = 0; i < 42; i += 1) {
    const day = i - firstWeekday + 1;
    cells.push(day >= 1 && day <= daysInMonth ? day : null);
  }

  return cells;
}

export default function EditorPage({ calendarId, onBackHome }: EditorPageProps) {
  const [calendar, setCalendar] = useState<CalendarSummary | null>(null);
  const [error, setError] = useState("");
  const [isOpeningSidebar, setIsOpeningSidebar] = useState(false);
  const [openingMenu, setOpeningMenu] = useState<"calendar" | "export" | "print" | null>(null);
  const sideMenuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calendarId) return;

    (async () => {
      try {
        setError("");
        const res = await fetch("/api/calendars");
        if (!res.ok) throw new Error("Failed to load calendar");

        const data = await res.json();
        const found = (data.calendars as CalendarSummary[]).find((item) => item.id === calendarId) ?? null;
        setCalendar(found);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    })();
  }, [calendarId]);

  const today = new Date();
  const displayYear = calendar?.year ?? today.getFullYear();
  const displayMonth = calendar?.month ?? today.getMonth() + 1;
  const displayTitle = calendar?.name ?? `${displayYear}年 ${displayMonth}月`;
  const cells = useMemo(() => buildMonthCells(displayYear, displayMonth), [displayYear, displayMonth]);

  return (
    <React.Fragment>
      <div className="h-screen w-full flex flex-col overflow-hidden relative bg-gray-50">
        {/* ヘッダー */}
        <nav className="w-full shrink-0 h-12 flex items-center z-101 justify-between gap-2 bg-white shadow">
          <div className="flex items-center gap-2">
            <button className="group cursor-pointer flex items-center justify-center size-12" onClick={onBackHome}>
              <div className="size-10 flex leading-none transition-all rounded-lg duration-200 items-center justify-center text-2xl group-hover:bg-gray-100">
                👈
              </div>
            </button>
          </div>
          <div className="text-sm text-zinc-600 mr-6">
            {calendar && `${calendar.name} (${calendar.year}/${calendar.month})`}
          </div>
        </nav>

        <div className="mx-auto flex-1 w-full flex items-center justify-center pr-16">
          <div className="overflow-x-auto">
            {/* A4カレンダー表示 */}
            <section className="calendar-pdf-root">
              <div className="calendar-pdf-canvas">
                <header>
                  <h1 className="calendar-pdf-title">
                    {displayTitle}
                  </h1>
                </header>

                <div className="calendar-pdf-grid">
                  <div className="calendar-pdf-header-row">
                    {WEEK_LABELS.map((label, labelIdx) => (
                      <div
                        key={label}
                        className={`calendar-pdf-weekday ${labelIdx === 0 ? "calendar-pdf-sun" : ""} ${labelIdx === 6 ? "calendar-pdf-sat" : ""}`}
                      >
                        {label}
                      </div>
                    ))}
                  </div>

                  <div className="calendar-pdf-week-row">
                    {cells.map((day, dayIdx) => {
                      const weekDay = dayIdx % 7;
                      return (
                        <div
                          key={`cell-${dayIdx}`}
                          className={`calendar-pdf-cell ${!day ? "calendar-pdf-cell-empty" : ""} hover:bg-gray-100 hover:box-content hover:z-50! cursor-pointer hover:shadow-lg! hover:border-b-2! hover:border-r-2! hover:border-violet-400!`}
                        >
                          {day && (
                            <div
                              className={`calendar-pdf-day-number ${weekDay === 0 ? "calendar-pdf-sun" : weekDay === 6 ? "calendar-pdf-sat" : ""}`}
                            >
                              {day}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      {/* サイドバー */}
      <aside
        ref={sideMenuRef}
        className={`flex pt-12 flex-row-reverse fixed h-full right-0 top-0 shadow-lg transition-all duration-200 z-100 bg-white ${isOpeningSidebar ? "w-96" : "w-16"}`}
      >
        <div className="flex flex-col items-start h-full relative z-1">
          <button
            className="size-16 relative group cursor-pointer flex items-center justify-center"
            onClick={() => {
              if (openingMenu !== "calendar") {
                setIsOpeningSidebar(true);
                setOpeningMenu("calendar");
              } else {
                setIsOpeningSidebar(false);
                setOpeningMenu(null);
              }
            }}
          >
            <div className="size-12 flex transition-all rounded-lg duration-200 items-center justify-center text-3xl group-hover:bg-gray-100">
              {isOpeningSidebar && openingMenu === "calendar" ? "👉" : "📅"}
            </div>
          </button>
          <button
            className="size-16 relative group cursor-pointer flex items-center justify-center"
            onClick={() => {
              if (openingMenu !== "export") {
                setIsOpeningSidebar(true);
                setOpeningMenu("export");
              } else {
                setIsOpeningSidebar(false);
                setOpeningMenu(null);
              }
            }}
          >
            <div className="size-12 flex transition-all rounded-lg duration-200 items-center justify-center text-3xl group-hover:bg-gray-100">
              {isOpeningSidebar && openingMenu === "export" ? "👉" : "📤"}
            </div>
          </button>
          <button
            className="size-16 relative group cursor-pointer flex items-center justify-center"
            onClick={() => {
              if (openingMenu !== "print") {
                setIsOpeningSidebar(true);
                setOpeningMenu("print");
              } else {
                setIsOpeningSidebar(false);
                setOpeningMenu(null);
              }
            }}
          >
            <div className="size-12 flex transition-all rounded-lg duration-200 items-center justify-center text-3xl group-hover:bg-gray-100">
              {isOpeningSidebar && openingMenu === "print" ? "👉" : "🖨️"}
            </div>
          </button>
        </div>
        {isOpeningSidebar && (
          <div className="w-80 p-6 overflow-x-visible whitespace-nowrap relative">
            {openingMenu === "calendar" && (
              <div>
                <div className="text-xl font-line text-gray-700 font-semibold mb-4">
                  📅カレンダー設定
                </div>
                <p>設定項目</p>
              </div>
            )}
            {openingMenu === "export" && (
              <div>
                <div className="text-xl font-line text-gray-700 font-semibold mb-4">
                  📤エクスポート
                </div>
                <div>設定項目</div>
                <div>
                  {calendarId && (
                    <a
                      className="text-sm"
                      href={`/api/calendars/${calendarId}/pdf`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      PDF表示
                    </a>
                  )}
                </div>
              </div>
            )}
            {openingMenu === "print" && (
              <div>
                <div className="text-xl font-line text-gray-700 font-semibold mb-4">
                  🖨️印刷設定
                </div>
                <p>設定項目</p>
              </div>
            )}
          </div>
        )}
      </aside>
    </React.Fragment>
  );
}
