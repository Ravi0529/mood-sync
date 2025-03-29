"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/moods`);
      const data = await res.json();
      setMoods(data);
    } finally {
      setIsLoading(false);
    }
  };

  const submitMood = async () => {
    if (!mood) {
      alert("Please select a mood");
      return;
    }

    setIsSubmitting(true);
    try {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const editMood = (moodEntry: Mood) => {
    setEditingMood(moodEntry);
    setMood(moodEntry.mood);
    setNote(moodEntry.note);
  };

  const deleteMood = async (id: string) => {
    if (!confirm("Are you sure you want to delete this mood entry?")) return;
    
    setIsSubmitting(true);
    try {
      await fetch(`/api/moods`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchMoods();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/50 rounded-xl p-6 shadow-md backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          {editingMood ? "Edit Your Mood" : "How Are You Feeling?"}
        </h2>
        <div className="space-y-4">
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none 
                     focus:border-purple-500 transition-colors bg-white"
            disabled={isSubmitting}
          >
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
            className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none 
                     focus:border-purple-500 transition-colors"
            disabled={isSubmitting}
          />

          <button
            onClick={submitMood}
            disabled={isSubmitting}
            className="w-full px-4 py-3 text-white font-medium rounded-lg
                     bg-gradient-to-r from-purple-500 to-pink-500 
                     hover:from-purple-600 hover:to-pink-600
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                     transform transition-all duration-200 hover:scale-[1.02]
                     disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              editingMood ? "Update Mood" : "Save Mood"
            )}
          </button>
        </div>
      </div>

      <div className="bg-white/50 rounded-xl p-6 shadow-md backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">Your Mood History</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : moods.length === 0 ? (
          <p className="text-center text-gray-600 py-4">No moods recorded yet. Start by logging your first mood!</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {moods.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xl">{m.mood}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(m.date).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-gray-700 mb-3 text-sm">{m.note || "(No note added)"}</p>
                <div className="flex space-x-2 text-sm">
                  <button
                    onClick={() => editMood(m)}
                    className="px-3 py-1 text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                    disabled={isSubmitting}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMood(m.id)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    disabled={isSubmitting}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trends Link */}
      <div className="flex justify-center">
        <Link
          href="/trends"
          className="inline-flex items-center px-6 py-3 text-white font-medium rounded-lg
                   bg-gradient-to-r from-purple-500 to-pink-500 
                   hover:from-purple-600 hover:to-pink-600
                   transform transition-all duration-200 hover:scale-[1.02]
                   shadow-md hover:shadow-lg"
        >
          Monitor Your Mood Trends
        </Link>
      </div>
    </div>
  );
}
