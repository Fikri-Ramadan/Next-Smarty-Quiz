import HistoryCard from '@/components/dashboard/HistoryCard';
import HotTopicsCard from '@/components/dashboard/HotTopicsCard';
import RecentAcitivityCard from '@/components/dashboard/RecentAcitivityCard';
import StartQuizCard from '@/components/dashboard/StartQuizCard';
import { getAuthSession } from '@/lib/nextAuth';
import { redirect } from 'next/navigation';

type Props = {};

export const metadata = {
  title: 'Dashboard | Smarty Quiz',
  description: 'Quiz yourself with AI power',
};

const Dashboard = async (props: Props) => {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect('/');
  }

  return (
    <main className="max-w-7xl mx-auto p-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <StartQuizCard />
        <HistoryCard />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <HotTopicsCard />
        <RecentAcitivityCard />
      </div>
    </main>
  );
};
export default Dashboard;
