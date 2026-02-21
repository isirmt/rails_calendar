import HomeCalendar from "../components/homeCalendar";

type HomePageProps = {
  onGoEditor: (calendarId: number) => void;
};

export default function HomePage({ onGoEditor }: HomePageProps) {
  return (
    <div className="block relative">
      <aside className="w-20 bg-gray-300 h-screen fixed left-0 top-0 hover:w-64 z-50 transition-all duration-200">
        {/* サイドバー */}
      </aside>

      <div className="flex-1 relative pl-36 min-h-svh w-full flex flex-col items-start p-16 gap-8">
        <HomeCalendar onGoEditor={onGoEditor} />

        <footer className="w-full relative">
          <div className="flex text-sm gap-3 w-full items-center justify-center relative">
            <div>使い方</div>
            <div className="select-none">-</div>
            <div>
              <a href="https://github.com/isirmt/rails_calendar" className="hover:underline" target="_blank" rel="noopener">
                リポジトリ
              </a>
            </div>
            <div className="select-none">-</div>
            <div>
              <a href="https://github.com/isirmt/rails_calendar/issues" className="hover:underline" target="_blank" rel="noopener">
                フィードバック
              </a>
            </div>
            <div className="select-none">-</div>
            <div>
              &copy;&nbsp;
              <a href="https://isirmt.com" className="hover:underline" target="_blank" rel="noopener">
                isirmt
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
