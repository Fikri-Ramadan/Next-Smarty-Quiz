import { CheckCircle2, XCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

type Props = {
  correctAnswer: number;
  wrongAnswer: number;
};

const MCQCounter = ({ correctAnswer, wrongAnswer }: Props) => {
  return (
    <Card className="flex items-center justify-center p-2">
      <CheckCircle2 color={'green'} className="w-6 h-6 md:w-8 md:h-8" />
      <span className="text-xl md:text-2xl text-green-500 mx-3">
        {correctAnswer}
      </span>
      <Separator orientation="vertical" />
      <span className="text-xl md:text-2xl text-red-500 mx-3">
        {wrongAnswer}
      </span>
      <XCircle color={'red'} className="w-6 h-6 md:w-8 md:h-8" />
    </Card>
  );
};

export default MCQCounter;
