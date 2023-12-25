import { quizCreationSchema } from "@/app/schemas/form/quiz";
import { strictOutput } from "@/lib/gpt";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const POST = async (req: Request, res: Response) => {
  try {
    // const session = await getAuthSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'You must be logged in to create a game.' }, { status: 401 });
    // }

    console.log(process.env.OPENAI_API_KEY);

    const body = await req.json();
    const { amount, topic, type } = quizCreationSchema.parse(body);

    let questions: any;

    if (type === 'open_ended') {
      questions = await strictOutput(
        'You are a helpful AI that is able to generate a pair of question and answers, the length of each asnwer should not be more than 15 words, store all the pars of answers and questions in a JSON array',
        new Array(amount).fill(
          `You are to generate a random hard open-ended questions about ${topic}`
        ),
        {
          question: 'question',
          answer: 'answer with max length of words'
        }
      );
    } else if (type === 'mcq') {
      questions = await strictOutput(
        'You are helpful AI that is able to generate mcq questions answers, the length of each answer should not be more than 15 words, store all answers and questions and options in a JSON array',
        new Array(amount).fill(
          `You are to generate a random hard mcq question about ${topic}`
        ),
        {
          question: 'question',
          answer: 'answer with max length of 15 words',
          option1: 'option1 with max length of 15 words',
          option2: 'option2 with max length of 15 words',
          option3: 'option3 with max length of 15 words',
        }
      );
    }

    return NextResponse.json(
      {
        questions: questions,
      },
      {
        status: 200
      }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    } else {
      console.error('GPT error:', error);
      return NextResponse.json({ error: 'An expected error occured.' }, { status: 500 });
    }
  }
};