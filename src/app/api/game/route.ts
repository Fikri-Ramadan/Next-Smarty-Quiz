import { quizCreationSchema } from "@/schemas/form/quiz";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextAuth";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import axios from 'axios';

export const POST = async (req: Request, res: Response) => {
  const session = await getAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "You must be logged in to access this quiz." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { amount, topic, type } = quizCreationSchema.parse(body);
    const game = await prisma.game.create({
      data: {
        userId: session.user.id,
        gameType: type,
        timeStarted: new Date(),
        topic,
      }
    });

    const { data } = await axios.post(
      `${process.env.API_URL}/api/questions`,
      { topic, amount, type }
    );

    if (type === 'mcq') {
      type mcqQuestion = {
        question: string,
        answer: string,
        option1: string,
        option2: string,
        option3: string,
      };

      const datas = data.questions.map((question: mcqQuestion) => {
        const options = [
          question.option1,
          question.option2,
          question.option3,
          question.answer
        ].sort(() => Math.random() - 0.5);

        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          gameId: game.id,
          questionType: 'mcq'
        };
      });

      await prisma.question.createMany({
        data: datas
      });
    } else if (type === 'open_ended') {
      type openQuestion = {
        question: string,
        answer: string,
      };

      const datas = data.questions.map((question: openQuestion) => {
        return {
          question: question.question,
          answer: question.answer,
          gameId: game.id,
          questionType: 'open_ended'
        };
      });

      await prisma.question.createMany({
        data: datas
      });
    }

    return NextResponse.json({ gameId: game.id }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    return NextResponse.json({ error: 'Something went wrong!' }, { status: 500 });
  }
};