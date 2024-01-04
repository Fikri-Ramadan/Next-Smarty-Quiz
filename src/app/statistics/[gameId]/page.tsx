import AccuracyCard from '@/components/statistics/AccuracyCard';
import QuestionList from '@/components/statistics/QuestionList';
import ResultCard from '@/components/statistics/ResultCard';
import TimeTakenCard from '@/components/statistics/TimeTakeCard';
import { buttonVariants } from '@/components/ui/button';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextAuth';
import { LucideLayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type Props = {
  params: { gameId: string };
};

const StatisticPage = async ({ params: { gameId } }: Props) => {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect('/');
  }

  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      questions: true,
    },
  });

  if (!game) {
    return redirect('/dashboard');
  }

  let accuracy: number = 0;
  if (game.gameType === 'mcq') {
    let totalCorrect = game.questions.reduce((acc, question) => {
      if (question.isCorrect) {
        return acc + 1;
      }
      return acc;
    }, 0);

    accuracy = (totalCorrect / game.questions.length) * 100;
  } else if (game.gameType === 'open_ended') {
    let averagePercentage = game.questions.reduce((acc, question) => {
      return acc + (question.percentageCorrect || 0);
    }, 0);

    accuracy = averagePercentage / game.questions.length;
  }

  accuracy = Math.round(accuracy * 100) / 100;

  return (
    <div className="p-8 mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 items-center justify-between md:flex-row">
        <h2 className="font-bold text-3xl tracking-tight">Summary</h2>
        <div className="flex items-center gap-2">
          <Link href={'/dashboard'} className={buttonVariants()}>
            <LucideLayoutDashboard className="mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-7">
        <ResultCard accuracy={accuracy} />
        <AccuracyCard accuracy={accuracy} />
        <TimeTakenCard
          timeStarted={new Date(game.timeStarted || 0)}
          timeEnded={new Date(game.timeEnded || 0)}
        />
      </div>

      <QuestionList questions={game.questions} />
    </div>
  );
};

export default StatisticPage;
