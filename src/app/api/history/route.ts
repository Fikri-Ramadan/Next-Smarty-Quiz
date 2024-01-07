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

export const PUT = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const { topic, amount, type } = body;

    const data = {
      topic, amount, type
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/questions`, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    const realResponse = await response.json();
    return NextResponse.json({ realResponse });
  } catch (error) {

  }
};