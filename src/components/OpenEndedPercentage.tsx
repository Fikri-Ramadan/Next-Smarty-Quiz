import { Percent, Target } from 'lucide-react';
import { Card } from './ui/card';

type Props = {
  percentage: number;
};

const OpenEndedPercentage = ({ percentage }: Props) => {
  return (
    <Card className="flex items-center p-2">
      <Target className="w-8 h-8" />
      <span className='ml-3 text-2xl opacity-75'>{percentage}</span>
      <Percent className="w-6 h-6" />
    </Card>
  );
};

export default OpenEndedPercentage;
