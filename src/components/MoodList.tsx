"use client";
import { useEffect, useState } from "react";

interface Mood {
  mood: string;
  note: string;
  date: string;
}

export default function MoodList({ userId }: { userId: string }) {
  const [moods, setMoods] = useState<Mood[]>([]);

  useEffect(() => {
    async function fetchMoods() {
      const res = await fetch(`/api/moods`);
      const data = await res.json();
      setMoods(data);
    }
    fetchMoods();
  }, [userId, moods]);

  return (
    <div>
      <h2>Your Mood History</h2>
      {moods.map((m, idx) => (
        <div key={idx}>
          {m.mood} - {m.note}
        </div>
      ))}
    </div>
  );
}
