import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const moodToNumber: Record<string, number> = {
  HAPPY: 5,
  EXCITED: 4,
  NEUTRAL: 3,
  TIRED: 2,
  SAD: 1,
};

export const GET = async () => {
  try {
    const moods = await prisma.moodEntry.findMany({
      orderBy: {
        date: "asc",
      },
    });

    const formattedMoods = moods.map((m) => ({
      id: m.id,
      mood: moodToNumber[m.mood] || 3,
      note: m.note,
      date: m.date.toISOString().split("T")[0], // YYYY-MM-DD
    }));

    return NextResponse.json(formattedMoods, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch moods", status: error.status || 500 },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
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
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create mood entry" },
      { status: 500 }
    );
  }
};
