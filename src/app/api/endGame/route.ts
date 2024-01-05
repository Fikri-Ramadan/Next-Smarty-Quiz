import { prisma } from "@/lib/db";
import { endGameSchema } from "@/schemas/question";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const { gameId } = endGameSchema.parse(body);

    const game = await prisma.game.findUnique({
      where: {
        id: gameId
      }
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    await prisma.game.update({
      where: {
        id: gameId,
      },
      data: {
        timeEnded: new Date(),
      }
    });

    return NextResponse.json({ message: 'Game ended' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
};