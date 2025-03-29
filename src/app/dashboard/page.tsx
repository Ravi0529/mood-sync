"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MoodForm from "@/components/MoodForm";
import MoodList from "@/components/MoodList";

export default function Dashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      router.push("/");
    } else {
      setUserId(id);
    }
  }, []);

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Mood Tracker Dashboard</h1>
      <MoodForm userId={userId} />
      <MoodList userId={userId} />
    </div>
  );
}
