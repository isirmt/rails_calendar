import React, { useState } from "react";

type HomePageProps = {
  defaultCalendarId: number;
  onGoEditor: (calendarId: number) => void;
};

export default function HomePage({ defaultCalendarId, onGoEditor }: HomePageProps) {
  const [calendarIdInput, setCalendarIdInput] = useState<number>(defaultCalendarId);

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Top Page</h1>
      <button onClick={() => onGoEditor(1)}>Go to Editor</button>
    </div>
  );
}
