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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/moods");
        const data = await response.json();

        const formattedData = data.map((entry: any) => ({
          ...entry,
          mood: moodToNumber[entry.mood] || 3,
        }));

        setMoodData(formattedData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMoods();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-8">
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors mb-4 md:mb-0"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Mood Journey
            </h1>
          </div>

          {/* Description */}
          <div className="text-center mb-4 sm:mb-8">
            <p className="text-gray-600 text-sm sm:text-base">
              Visualizing your emotional patterns over time
            </p>
            <div className="flex justify-center space-x-4 mt-2 text-xl sm:text-2xl">
              <span>😢</span>
              <span>😪</span>
              <span>😐</span>
              <span>😃</span>
              <span>😊</span>
            </div>
          </div>

          {/* Chart Section */}
          {isLoading ? (
            <div className="h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-purple-600 font-medium text-sm sm:text-base">
                  Loading your mood data...
                </p>
              </div>
            </div>
          ) : moodData.length === 0 ? (
            <div className="h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center">
              <p className="text-gray-500 text-center text-sm sm:text-base px-4">
                No mood data available yet. Start tracking your moods to see
                trends!
              </p>
            </div>
          ) : (
            <div className="h-[300px] sm:h-[400px] md:h-[500px] mt-4 sm:mt-6 -mx-4 sm:mx-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={moodData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 10,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    tick={{ fill: "#64748b", fontSize: "0.75rem" }}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    domain={[1, 5]}
                    tickFormatter={(tick) =>
                      ["😢", "😪", "😐", "😃", "😊"][tick - 1]
                    }
                    stroke="#64748b"
                    tick={{ fill: "#64748b", fontSize: "0.875rem" }}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      fontSize: "0.875rem",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="url(#colorGradient)"
                    strokeWidth={3}
                    dot={{ fill: "#a855f7", strokeWidth: 1, r: 4 }}
                    activeDot={{
                      r: 7,
                      fill: "#a855f7",
                      strokeWidth: 2,
                    }}
                  />
                  <defs>
                    <linearGradient
                      id="colorGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
