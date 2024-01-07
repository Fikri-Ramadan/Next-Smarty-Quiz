import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const { limit, userId } = body;

    const history = await prisma.game.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        timeStarted: "desc",
      },
      take: limit,
    });

    return NextResponse.json({ history }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
};