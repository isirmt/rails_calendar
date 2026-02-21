import React, { useState } from "react";

type HomePageProps = {
  defaultCalendarId: number;
  onGoEditor: (calendarId: number) => void;
};

export default function HomePage({ defaultCalendarId, onGoEditor }: HomePageProps) {
  return (
    <div className="block relative">
      <aside className="w-20 bg-gray-300 h-screen fixed left-0 top-0 hover:w-64 z-100 transition-all duration-200">
        {/* サイドバー */}
      </aside>
      <div className="flex-1 relative pl-36 min-h-svh w-full flex flex-col items-start p-16 gap-8">
        <section className="flex relative w-full flex-col gap-6 font-line border border-gray-200 rounded-2xl shadow-lg py-6 px-6">
          <div className="text-3xl font-bold text-gray-800">最近開いたカレンダー</div>
          <div className="w-full flex gap-6 relative px-6">
            <div className="w-48 relative">
              <div className="w-full aspect-[1.414/1] bg-black rounded"></div>
              <div className="mt-2">カレンダータイトル</div>
              <div>2026年2月</div>
            </div>
          </div>
        </section>
        <div className="border w-full p-8">
          <div className="flex items-center justify-center font-line text-gray-700 text-3xl font-black">
            <div>2026年</div>
          </div>
          <div className="flex">
            <button>1</button>
          </div>
        </div>
        <footer className="w-full relative">
          <div className="flex text-sm gap-3 w-full items-center justify-center relative">
            <div>使い方</div>
            <div className="select-none">-</div>
            <div><a href="https://github.com/isirmt/rails_calendar" className="hover:underline" target="_blank" rel="noopener">リポジトリ</a></div>
            <div className="select-none">-</div>
            <div><a href="https://github.com/isirmt/rails_calendar/issues" className="hover:underline" target="_blank" rel="noopener">フィードバック</a></div>
            <div className="select-none">-</div>
            <div>&copy;&nbsp;<a href="https://isirmt.com" className="hover:underline" target="_blank" rel="noopener">isirmt</a></div>
          </div>
        </footer>
        {/* <button onClick={() => onGoEditor(1)}>Go to Editor</button> */}
      </div>
    </div>
  );
}
