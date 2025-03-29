"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MoodEntry {
  id: string;
  mood: string;
  note: string;
  date: string;
}

const moodToNumber: Record<string, number> = {
  "😊": 5,
  "😃": 4,
  "😐": 3,
  "😪": 2,
  "😢": 1,
};

export default function Trends() {
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await fetch("/api/moods");
        const data = await response.json();

        const formattedData = data.map((entry: any) => ({
          ...entry,
          mood: moodToNumber[entry.mood] || 3,
        }));

        // setMoodData(data);
        setMoodData(formattedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMoods();
  }, []);

  return (
    <div className="p-6">
      <div>
        <Link href="/dashboard" className="text-blue-500 underline">
          Back to dashboard
        </Link>
      </div>
      <h1 className="text-3xl font-bold mt-4">Mood Trends</h1>
      <p className="mt-4">
        Below is a visualization of your mood trends over time.
      </p>

      <div className="mt-6 w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={moodData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              domain={[1, 5]}
              tickFormatter={(tick) => ["😢", "😪", "😐", "😃", "😊"][tick - 1]}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#8884d8"
              strokeWidth={2}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
