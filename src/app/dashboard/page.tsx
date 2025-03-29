"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Mood from "@/components/Mood";

export default function Dashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const id = localStorage.getItem("userId");
        if (!id) {
          router.push("/");
        } else {
          setUserId(id);
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-purple-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Your Mood Dashboard
          </h1>
          <div className="flex justify-center space-x-2 text-2xl mb-4">
            <span>😊</span>
            <span>😃</span>
            <span>😐</span>
            <span>😪</span>
            <span>😢</span>
          </div>
          <p className="text-gray-600">
            Track and visualize your emotional journey
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-90 p-6 md:p-8">
          {userId && <Mood userId={userId} />}
        </div>
      </div>
    </div>
  );
}
