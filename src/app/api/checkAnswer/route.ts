import { prisma } from "@/lib/db";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { compareTwoStrings } from "string-similarity";
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
      let percentageSimilar = compareTwoStrings(
        userAnswer.toLowerCase().trim(),
        question.answer.toLowerCase().trim()
      );

      percentageSimilar = Math.round(percentageSimilar * 100);

      await prisma.question.update({
        where: {
          id: questionId
        },
        data: {
          percentageCorrect: percentageSimilar
        }
      });

      return NextResponse.json({
        percentageSimilar,
      }, { status: 200 });
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