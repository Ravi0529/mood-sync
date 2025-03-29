"use client";
import { useState, useEffect } from "react";

interface Mood {
  id: string;
  mood: string;
  note: string;
  date: string;
}

export default function MoodForm({ userId }: { userId: string }) {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [moods, setMoods] = useState<Mood[]>([]);
  const [editingMood, setEditingMood] = useState<Mood | null>(null);

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    const res = await fetch(`/api/moods`);
    const data = await res.json();
    setMoods(data);
  };

  const submitMood = async () => {
    if (!mood) {
      alert("Please select a mood");
      return;
    }

    if (editingMood) {
      await fetch(`/api/moods`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingMood.id, mood, note }),
      });
      setEditingMood(null);
    } else {
      await fetch("/api/moods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, note, userId }),
      });
    }

    setMood("");
    setNote("");
    fetchMoods();
  };

  const editMood = (moodEntry: Mood) => {
    setEditingMood(moodEntry);
    setMood(moodEntry.mood);
    setNote(moodEntry.note);
  };

  const deleteMood = async (id: string) => {
    await fetch(`/api/moods`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchMoods();
  };

  return (
    <section>
      <div>
        <h2>{editingMood ? "Edit Mood" : "Log Your Mood"}</h2>
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
        <button onClick={submitMood}>
          {editingMood ? "Update Mood" : "Submit"}
        </button>
      </div>

      <div>
        <h2>Your Mood History</h2>
        {moods.map((m) => (
          <div key={m.id}>
            <div>
              {m.mood} - {m.note || "(No note added)"} - {m.date}
            </div>
            <div>
              <button onClick={() => editMood(m)}>Edit Mood</button>
              <button onClick={() => deleteMood(m.id)}>Delete Mood</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
