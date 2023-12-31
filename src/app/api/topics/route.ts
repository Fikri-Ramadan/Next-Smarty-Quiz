import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (_req: Request, _res: Response) => {
  try {
    const topics = await prisma.topicCount.findMany({
      orderBy: {
        count: "asc"
      }
    });

    return NextResponse.json({ topics }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
};