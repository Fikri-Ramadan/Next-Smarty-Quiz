import { Hourglass } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatTimeDelta } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns';

type Props = {
  timeStarted: Date;
  timeEnded: Date;
};

const TimeTakenCard = ({ timeStarted, timeEnded }: Props) => {
  return (
    <Card className="md:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Time Taken</CardTitle>
        <Hourglass />
      </CardHeader>
      <CardContent className="font-medium">
        {formatTimeDelta(differenceInSeconds(timeEnded, timeStarted))}
      </CardContent>
    </Card>
  );
};

export default TimeTakenCard;
