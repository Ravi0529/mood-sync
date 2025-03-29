"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    if (!name) {
      alert("Please enter your name.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const user = await res.json();
      localStorage.setItem("userId", user.id);
      router.push("/dashboard");
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-blue-50">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-90">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mood Tracker
            </h1>
            <div className="flex justify-center space-x-2 text-3xl">
              <span>😊</span>
              <span>😃</span>
              <span>😐</span>
              <span>😪</span>
              <span>😢</span>
            </div>
            <p className="text-gray-600 mt-2">
              Track your emotional journey, one moment at a time
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-400"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handleStart}
              disabled={isLoading}
              className="w-full px-4 py-3 text-white font-medium rounded-lg
                       bg-gradient-to-r from-purple-500 to-pink-500 
                       hover:from-purple-600 hover:to-pink-600
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                       transform transition-all duration-200 hover:scale-[1.02]
                       disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  <span>Starting Journey...</span>
                </div>
              ) : (
                "Start Your Journey"
              )}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            Begin tracking your emotional wellbeing today
          </div>
        </div>
      </div>
    </div>
  );
}
