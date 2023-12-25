'use client';

import { Game, Question } from '@prisma/client';
import { ChevronRight, Timer } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useMemo, useState } from 'react';

type Props = {
  game: Game & { questions: Pick<Question, 'id' | 'question' | 'options'>[] };
};

const MCQ = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedChoices, setSelectedChoices] = useState<number>(-1);

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  return (
    <div className="mt-16 md:mt-32 mx-auto md:w-[80vw] max-w-4xl w-[90vw]">
      <div className="flex flex-row justify-between">
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
          {'00.00'}
        </div>
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
            {game.questions[0].question}
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
        <Button className="mt-2 mb-32" variant={'default'} size={'lg'}>
          Next <ChevronRight className="w-4- h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default MCQ;
