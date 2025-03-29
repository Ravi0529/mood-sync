import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
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
