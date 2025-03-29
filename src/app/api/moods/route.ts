import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type MoodEntry = {
  id: string;
  userId: string;
  mood: "HAPPY" | "EXCITED" | "NEUTRAL" | "TIRED" | "SAD";
  note: string | null;
  date: Date;
};

const moodToEmoji: Record<MoodEntry["mood"], string> = {
  HAPPY: "😊",
  EXCITED: "😃",
  NEUTRAL: "😐",
  TIRED: "😪",
  SAD: "😢",
};

export const GET = async () => {
  try {
    const moods = await prisma.moodEntry.findMany({
      orderBy: {
        date: "asc",
      },
    });

    const formattedMoods = moods.map((m: MoodEntry) => ({
      id: m.id,
      mood: moodToEmoji[m.mood] || "😐",
      note: m.note,
      date: m.date.toISOString().split("T")[0], // YYYY-MM-DD
    }));

    return NextResponse.json(formattedMoods, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching moods:", error);
    return NextResponse.json(
      { error: "Failed to fetch moods", status: 500 },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { userId, mood, note } = await req.json();

    if (!userId || !mood) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newMood = await prisma.moodEntry.create({
      data: {
        userId,
        mood,
        note,
      },
    });

    return NextResponse.json(newMood, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating mood:", error);
    return NextResponse.json(
      { error: "Failed to create mood entry" },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const { id, mood, note } = await req.json();

    if (!id || !mood) {
      return NextResponse.json(
        { error: "ID and Mood are required" },
        { status: 400 }
      );
    }

    const updatedMood = await prisma.moodEntry.update({
      where: { id },
      data: {
        mood,
        note,
      },
    });

    return NextResponse.json(updatedMood, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating mood:", error);
    return NextResponse.json(
      { error: "Failed to update mood entry" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing Mood ID" }, { status: 400 });
    }

    await prisma.moodEntry.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: "Mood deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting mood:", error);
    return NextResponse.json(
      { error: "Failed to delete mood entry" },
      { status: 500 }
    );
  }
};
