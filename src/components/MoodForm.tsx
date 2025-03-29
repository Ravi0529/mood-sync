"use client";
import { useState } from "react";

export default function MoodForm({ userId }: { userId: string }) {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");

  const submitMood = async () => {
    if (!mood) {
      alert("Please select a mood");
      return;
    }

    await fetch("/api/moods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, note, userId }),
    });

    setMood("");
    setNote("");
  };

  return (
    <div>
      <h2>Log Your Mood</h2>
      <select value={mood} onChange={(e) => setMood(e.target.value)}>
        <option value="">Select Mood</option>
        <option value="HAPPY">😊 Happy</option>
        <option value="EXCITED">😃 Excited</option>
        <option value="NEUTRAL">😐 Neutral</option>
        <option value="TIRED">😪 Tired</option>
        <option value="SAD">😢 Sad</option>
      </select>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note (optional)"
      />
      <button onClick={submitMood}>Submit</button>
    </div>
  );
}
