import ResultCard from '@/components/statistics/ResultCard';
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
  });

  if (!game) {
    return redirect('/dashboard');
  }

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
        <ResultCard accuracy={25} />
        {/* <AccuracyCard /> */}
        {/* <TimeTakenCard /> */}
      </div>

      {/* <QuestionList /> */}
    </div>
  );
};

export default StatisticPage;
