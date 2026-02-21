import React from "react";

type EditorPageProps = {
  calendarId: number | null;
  onBackHome: () => void;
};

export default function EditorPage({ calendarId, onBackHome }: EditorPageProps) {
  return (
    <div className="">
      Editor {calendarId}
      <button onClick={onBackHome}>Back Home</button>
    </div>
  );
}
