import React, { useEffect, useMemo, useState } from "react";

type Calendar = {
  id: number;
  name: string;
  year: number;
  month: number;
  created_at: string;
  updated_at: string;
};

type HomeCalendarProps = {
  onGoEditor: (calendarId: number) => void;
  defaultYear?: number;
};

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function sortRecent(calendars: Calendar[]): Calendar[] {
  return [...calendars].sort((a, b) => {
    const aTime = Date.parse(a.updated_at || a.created_at || "");
    const bTime = Date.parse(b.updated_at || b.created_at || "");

    if (Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime) {
      return bTime - aTime;
    }

    return b.id - a.id;
  });
}

export default function HomeCalendar({ onGoEditor, defaultYear }: HomeCalendarProps) {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [tooltipMonth, setTooltipMonth] = useState<number | null>(null);
  const [creatingMonth, setCreatingMonth] = useState<number | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const monthButtonRefs = React.useRef<Record<number, HTMLButtonElement | null>>({});
  const tooltipRef = React.useRef<HTMLDivElement | null>(null);

  const recentCalendars = useMemo(() => sortRecent(calendars).slice(0, 8), [calendars]);
  const currentDate = useMemo(() => new Date(), []);
  const year = defaultYear ?? currentDate.getFullYear();

  const calendarsByMonth = useMemo(() => {
    const map = new Map<number, Calendar[]>();

    calendars.forEach((calendar) => {
      if (calendar.year !== year) return;

      const current = map.get(calendar.month) ?? [];
      current.push(calendar);
      current.sort((a, b) => b.id - a.id);
      map.set(calendar.month, current);
    });

    return map;
  }, [calendars, year]);

  const activeMonthCalendars = useMemo(() => {
    if (tooltipMonth == null) return [];
    return calendarsByMonth.get(tooltipMonth) ?? [];
  }, [calendarsByMonth, tooltipMonth]);

  function updateTooltipPosition(month: number) {
    const buttonEl = monthButtonRefs.current[month];
    if (!buttonEl) return;

    const rect = buttonEl.getBoundingClientRect();
    const tooltipWidth = tooltipRef.current?.offsetWidth ?? 288;
    const viewportPadding = 12;
    const verticalGap = 12;
    const tooltipHeight = tooltipRef.current?.offsetHeight ?? 256;

    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    left = Math.max(viewportPadding, Math.min(left, window.innerWidth - tooltipWidth - viewportPadding));

    let top = rect.bottom + verticalGap;
    if (top + tooltipHeight > window.innerHeight - viewportPadding) {
      const upwardTop = rect.top - tooltipHeight - verticalGap;
      if (upwardTop >= viewportPadding) {
        top = upwardTop;
      } else {
        top = Math.max(viewportPadding, window.innerHeight - tooltipHeight - viewportPadding);
      }
    }

    setTooltipStyle({ left, top });
  }

  async function fetchCalendars() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/calendars");
      if (!res.ok) throw new Error("カレンダーの取得に失敗しました");

      const data = await res.json();
      setCalendars(data.calendars as Calendar[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCalendars();
  }, []);

  useEffect(() => {
    if (tooltipMonth == null) return;

    updateTooltipPosition(tooltipMonth);

    const onViewportChange = () => updateTooltipPosition(tooltipMonth);
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);

    return () => {
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
    };
  }, [tooltipMonth, calendars]);

  useEffect(() => {
    if (tooltipMonth == null) return;

    const onOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const tooltipEl = tooltipRef.current;
      const buttonEl = monthButtonRefs.current[tooltipMonth];

      if (buttonEl?.contains(target) || tooltipEl?.contains(target)) return;

      setTooltipMonth(null);
    };

    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [tooltipMonth]);

  async function handleCreateCalendar(month: number) {
    setError("");
    setCreatingMonth(month);

    try {
      const res = await fetch("/api/calendars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calendar: {
            name: `${year}年${month}月 カレンダー`,
            year,
            month,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error((data.errors || ["カレンダーの作成に失敗しました"]).join(", "));

      const created = data.calendar as Calendar;
      await fetchCalendars();
      onGoEditor(created.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setCreatingMonth(null);
    }
  }

  return (
    <React.Fragment>
      <section className="flex relative w-full flex-col gap-6 border border-gray-200 rounded-2xl shadow-lg py-6 px-6">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="text-3xl font-bold text-gray-800">最近開いたカレンダー</div>
        </div>
        <div className="w-full flex gap-6 relative px-2 flex-wrap">
          <button className="w-48 relative text-left cursor-pointer group hover:opacity-80" onClick={() => handleCreateCalendar(currentDate.getMonth() + 1)}>
            <div className="w-full aspect-[1.414/1] bg-white border-2 border-dashed border-gray-300 box-border rounded" />
            <div className="mt-2 font-semibold text-gray-800 line-clamp-1">クリックして新規作成</div>
            <div className="text-sm text-gray-600">{currentDate.getFullYear()}年{currentDate.getMonth() + 1}月</div>
          </button>
          {recentCalendars.map((calendar) => (
            <button
              key={calendar.id}
              type="button"
              className="w-48 relative text-left cursor-pointer group hover:opacity-80"
              onClick={() => onGoEditor(calendar.id)}
            >
              <div className="w-full aspect-[1.414/1] bg-black box-border rounded" />
              <div className="mt-2 font-semibold text-gray-800 line-clamp-1">{calendar.name}</div>
              <div className="text-sm text-gray-600">{calendar.year}年{calendar.month}月</div>
            </button>
          ))}
        </div>
      </section>

      <section className="w-full relative p-8 flex gap-8 flex-col items-start">
        <div className="flex w-full items-center justify-center text-gray-700 text-3xl font-black">
          <div>{year}年</div>
        </div>

        <div className="flex w-full relative justify-between gap-8 flex-wrap">
          {MONTHS.map((month) => {
            const monthCalendars = calendarsByMonth.get(month) ?? [];
            const hasCalendars = monthCalendars.length > 0;

            return (
              <div key={month} className="relative">
                <button
                  type="button"
                  ref={(el) => {
                    monthButtonRefs.current[month] = el;
                  }}
                  className={`size-12 shrink-0 flex items-center cursor-pointer transition-all duration-200 select-none justify-center font-black text-2xl ${tooltipMonth === month ? "bg-indigo-500 text-white" : hasCalendars ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } ${hasCalendars ? "rounded-md" : "rounded-4xl"}`}
                  onClick={() => setTooltipMonth(month)}
                >
                  {month}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {tooltipMonth !== null && (
        <div
          ref={tooltipRef}
          className="fixed z-150 w-72 border border-gray-400 rounded-2xl bg-white p-4 shadow-xl select-none"
          style={tooltipStyle}
        >
          <div className="text-sm text-center font-semibold text-gray-800">{year}年{tooltipMonth}月</div>

          {activeMonthCalendars.length > 0 ? (
            <div className="mt-2 flex flex-col gap-2">
              <div className="text-xs text-gray-700">作成済みカレンダー</div>
              {activeMonthCalendars.slice(0, 3).map((calendar) => {
                const updatedAt = Date.parse(calendar.updated_at);
                const pastDays = Number.isFinite(updatedAt) ? Math.floor((Date.now() - updatedAt) / (1000 * 60 * 60 * 24)) : null;
                return (
                  <button
                    key={calendar.id}
                    type="button"
                    className="block w-full rounded-lg border border-gray-300 cursor-pointer px-3 py-1.5 text-left text-base hover:bg-gray-100 hover:border-gray-400"
                    onClick={() => onGoEditor(calendar.id)}
                  >
                    <div className="font-semibold">{calendar.name}</div>
                    {pastDays !== null && (
                      <div className="text-xs text-left text-gray-500">
                        {pastDays === 0 ? "今日更新" : `${pastDays}日前に更新`}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="mt-2 text-xs text-gray-700">この月のカレンダーはまだありません</div>
          )}

          <button
            type="button"
            className="mt-3 w-full rounded-lg tracking-wider bg-blue-600 hover:bg-blue-500 transition-all duration-200 cursor-pointer px-2 font-line font-bold py-1.5 text-sm text-white disabled:opacity-50"
            onClick={() => handleCreateCalendar(tooltipMonth)}
            disabled={creatingMonth !== null}
          >
            {creatingMonth === tooltipMonth ? "作成中" : "新規作成"}
          </button>
        </div>
      )}
    </React.Fragment>
  );
}
