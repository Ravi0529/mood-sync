import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (req: Request) => {
  const { name } = await req.json();
  let user = await prisma.user.findUnique({
    where: {
      name,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name,
      },
    });
  }

  return NextResponse.json(user, { status: 200 });
};
