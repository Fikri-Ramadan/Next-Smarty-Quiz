import { prisma } from "@/lib/db";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const { questionId, userAnswer } = checkAnswerSchema.parse(body);

    const question = await prisma.question.findUnique({
      where: {
        id: questionId
      }
    });

    if (!question) {
      return NextResponse.json({ error: "question not found" }, { status: 404 });
    }

    await prisma.question.update({
      where: {
        id: questionId
      },
      data: {
        userAnswer,
      }
    });

    if (question.questionType === 'mcq') {
      const isCorrect = userAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim();

      await prisma.question.update({
        where: {
          id: questionId
        },
        data: {
          isCorrect,
        }
      });

      return NextResponse.json({
        isCorrect
      }, { status: 200 });
    } else if (question.questionType === 'open_ended') {

    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    } else {
      console.error(error);
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
  }
};