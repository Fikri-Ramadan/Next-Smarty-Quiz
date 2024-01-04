import { Award, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type Props = {
  accuracy: number;
};

const ResultCard = ({ accuracy }: Props) => {
  return (
    <Card className="md:col-span-7">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="font-bold text-2xl">Results</CardTitle>
        <Award />
      </CardHeader>
      <CardContent className="flex flex-col items-center h-3/5">
        {accuracy === 100 ? (
          <>
            <Trophy stroke="gold" size={50} />
            <div className="flex flex-col items-center font-semibold text-2xl text-yellow-400">
              <span>Perfect!</span>
              <span className="text-sm text-center text-black opacity-50">
                100% Accuracy
              </span>
            </div>
          </>
        ) : accuracy > 75 ? (
          <>
            <Trophy stroke="green" size={50} />
            <div className="flex flex-col items-center font-semibold text-2xl text-green-400">
              <span>Imersive!</span>
              <span className="text-sm text-center text-black opacity-50">
                {'> 75% Accuracy'}
              </span>
            </div>
          </>
        ) : accuracy > 25 ? (
          <>
            <Trophy stroke="silver" size={50} />
            <div className="flex flex-col items-center font-semibold text-2xl text-stone-400">
              <span>Good Job!</span>
              <span className="text-sm text-center text-black opacity-50">
                {'> 25% Accuracy'}
              </span>
            </div>
          </>
        ) : (
          <>
            <Trophy stroke="brown" size={50} />
            <div className="flex flex-col items-center font-semibold text-2xl text-yellow-800">
              <span>Nice Try!</span>
              <span className="text-sm text-center text-black opacity-50">
                {'< 25% Accuracy'}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultCard;
