'use client';

import { cn, formatTimeDelta } from '@/lib/utils';
import { Game, Question } from '@prisma/client';
import { differenceInSeconds } from 'date-fns';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button, buttonVariants } from './ui/button';
import { BarChart, ChevronRight, Loader2, Timer } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { checkAnswerSchema } from '@/schemas/form/quiz';
import axios from 'axios';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useToast } from './ui/use-toast';
import Link from 'next/link';
import BlankInputAnswer from './BlankInputAnswer';
import OpenEndedPercentage from './OpenEndedPercentage';
import { endGameSchema } from '@/schemas/question';

type Props = {
  game: Game & { questions: Pick<Question, 'id' | 'question' | 'answer'>[] };
};

export const OpenEnded = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [gameIsEnded, setGameIsEnded] = useState<boolean>(false);
  const [blankAnswer, setBlankAnswer] = useState<string>('');
  const [now, setNow] = useState(new Date());

  const { toast } = useToast();

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      let filledAnswer = blankAnswer;
      document.querySelectorAll('#user-blank-input').forEach((input) => {
        filledAnswer = filledAnswer.replace(
          '_____',
          (input as HTMLInputElement).value
        );
        (input as HTMLInputElement).value = '';
      });

      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: filledAnswer,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API}/api/checkAnswer`,
        payload
      );

      return response.data;
    },
  });

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = {
        gameId: game.id,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API}/api/endGame`,
        payload
      );

      return response.data;
    },
  });

  const handleNext = useCallback(() => {
    if (isChecking) return;

    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilar }) => {
        toast({
          title: `Your answer is ${percentageSimilar}% similar to the correct answer.`,
          description: 'answers are matched based on similarity comparisons.',
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (questionIndex === game.questions.length - 1) {
          endGame();
          setGameIsEnded(true);
          return;
        }

        setQuestionIndex((prev) => prev + 1);
      },
    });
  }, [checkAnswer, isChecking, toast, game.questions.length, questionIndex, endGame]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleNext]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameIsEnded) setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [gameIsEnded]);

  if (gameIsEnded) {
    return (
      <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 flex flex-col">
        <div className="bg-green-500 text-white font-semibold whitespace-nowrap px-2 rounded-md">
          You completed in{' '}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          href={`/statistics/${game.id}`}
          className={cn(buttonVariants(), 'mt-2')}
        >
          View Statistics
          <BarChart className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-16 md:mt-32 mx-auto md:w-[80vw] max-w-4xl w-[90vw]">
      <div className="flex flex-row justify-between">
        <div>
          {/* topic */}
          <div className="flex items-center">
            <span className="text-slate-400 mr-2">Topic:</span>
            <span className="py-1 px-2 bg-slate-800 text-white rounded-lg">
              {game.topic}
            </span>
          </div>
          {/* timer */}
          <div className="flex mt-3 text-slate-400">
            <Timer className="mr-2" />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
        </div>
        <OpenEndedPercentage percentage={23} />
      </div>
      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="divide-y divide-zinc-600/50 mr-5 text-center">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col justify-center items-center mt-4 w-full">
        <BlankInputAnswer
          answer={currentQuestion.answer}
          setBlankAnswer={setBlankAnswer}
        />
        <Button
          className="mt-2 mb-32"
          variant={'default'}
          size={'lg'}
          onClick={handleNext}
          disabled={isChecking || gameIsEnded}
        >
          {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Next <ChevronRight className="w-4- h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OpenEnded;
