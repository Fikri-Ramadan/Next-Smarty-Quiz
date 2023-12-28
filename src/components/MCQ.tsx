'use client';

import { Game, Question } from '@prisma/client';
import { BarChart, ChevronRight, Loader2, Timer } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button, buttonVariants } from './ui/button';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MCQCounter from './MCQCounter';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { checkAnswerSchema } from '@/schemas/form/quiz';
import axios from 'axios';
import { useToast } from './ui/use-toast';
import Link from 'next/link';
import { cn, formatTimeDelta } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns';

type Props = {
  game: Game & { questions: Pick<Question, 'id' | 'question' | 'options'>[] };
};

const MCQ = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedChoices, setSelectedChoices] = useState<number>(-1);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [wrongAnswer, setWrongAnswer] = useState<number>(0);
  const [gameIsEnded, setGameIsEnded] = useState<boolean>(false);
  const [now, setNow] = useState(new Date());

  const { toast } = useToast();

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: options[selectedChoices],
      };

      const response = await axios.post(`/api/checkAnswer`, payload);

      return response.data;
    },
  });

  const handleNext = useCallback(() => {
    if (isChecking) return;

    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          toast({
            title: 'Correct!',
            description: 'Your answer is correct',
            variant: 'succes',
            duration: 3000,
          });

          setCorrectAnswer((prev) => prev + 1);
        } else if (!isCorrect) {
          toast({
            title: 'Incorrect!',
            description: 'Your answer is incorrect',
            variant: 'destructive',
            duration: 3000,
          });

          setWrongAnswer((prev) => prev + 1);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (questionIndex === game.questions.length - 1) {
          setGameIsEnded(true);
          return;
        }

        setSelectedChoices(-1);
        setQuestionIndex((prev) => prev + 1);
      },
    });
  }, [checkAnswer, isChecking, toast, game.questions.length, questionIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case '1':
          setSelectedChoices(0);
          break;
        case '2':
          setSelectedChoices(1);
          break;
        case '3':
          setSelectedChoices(2);
          break;
        case '4':
          setSelectedChoices(3);
          break;
        case 'Enter':
          handleNext();
          break;
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
        <MCQCounter correctAnswer={correctAnswer} wrongAnswer={wrongAnswer} />
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
        {options.map((option, index) => {
          return (
            <Button
              key={index}
              className="mb-4 py-8 w-full justify-start"
              variant={selectedChoices === index ? 'default' : 'outline'}
              onClick={() => {
                setSelectedChoices(index);
              }}
            >
              <span className="p-2 px-3 mr-5 border rounded-md">
                {index + 1}
              </span>
              <span className="text-start">{option}</span>
            </Button>
          );
        })}
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

export default MCQ;
