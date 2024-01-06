import OpenEnded from '@/components/OpenEnded';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextAuth';
import axios from 'axios';
import { redirect } from 'next/navigation';

type Props = {
  params: {
    gameId: string;
  };
};

const OpenEndedPage = async ({ params: { gameId } }: Props) => {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect('/');
  }

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_API}/api/game?gameId=${gameId}`
  );

  const game = data.game;

  if (!game || game.gameType !== 'open_ended') {
    return redirect('/quiz');
  }

  return <OpenEnded game={game} />;
};

export default OpenEndedPage;
