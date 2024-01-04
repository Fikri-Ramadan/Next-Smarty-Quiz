import { Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type Props = {
  accuracy: number;
};

const AccuracyCard = async ({ accuracy }: Props) => {
  return (
    <Card className="md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Avarage Accuracy</CardTitle>
        <Target />
      </CardHeader>
      <CardContent className="font-medium">
        {accuracy.toFixed(2).toString() + '%'}
      </CardContent>
    </Card>
  );
};

export default AccuracyCard;
