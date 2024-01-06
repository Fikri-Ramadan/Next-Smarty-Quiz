import History from '@/components/History';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAuthSession } from '@/lib/nextAuth';
import { LucideLayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const HistoryPage = async () => {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect('/');
  }

  return (
    <Card className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-10/12 md:w-[400px]">
      <CardHeader className="flex flex-col gap-4 items-center justify-between md:flex-row">
        <CardTitle className="font-bold text-2xl">History</CardTitle>
        <Link href={'/dashboard'} className={buttonVariants()}>
          <LucideLayoutDashboard className="mr-2" />
          Back to Dashboard
        </Link>
      </CardHeader>
      <CardContent className="max-h-[60vh] overflow-scroll">
        <History limit={100} userId={session.user.id} />
      </CardContent>
    </Card>
  );
};

export default HistoryPage;
