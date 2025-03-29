"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleStart = async () => {
    if (!name) {
      alert("Please enter your name.");
      return;
    }

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
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Welcome to Mood Tracker 😊</h1>
      <input
        type="text"
        className="mt-4 p-2 border rounded"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={handleStart}
        className="mt-2 bg-blue-500 text-white p-2 rounded"
      >
        Start Tracking
      </button>
    </div>
  );
}
