import { Game } from '@prisma/client';
import axios from 'axios';
import { Clock, CopyCheck, Edit2 } from 'lucide-react';
import Link from 'next/link';

type Props = {
  limit: number;
  userId: string;
};

const History = async ({ limit, userId }: Props) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_API}/api/history`,
    { limit, userId }
  );

  const games: Game[] = await res.data.history;

  return (
    <div className="ml-4 space-y-8">
      {games?.map((game, index) => {
        return (
          <div className="flex items-center justify-start" key={index}>
            {game.gameType === 'mcq' ? (
              <CopyCheck className="mr-3" />
            ) : (
              <Edit2 className="mr-3" />
            )}
            <div className="ml-4 space-y-1">
              <Link
                className="text-base font-medium leading-none underline"
                href={`/statistics/${game.id}`}
              >
                {game.topic}
              </Link>
              <span className="flex items-center text-sm text-white py-1 px-2 rounded-lg w-fit bg-slate-800">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(game.timeEnded || 0).toLocaleDateString('en-GB')}
              </span>
              <span className="text-sm text-muted-foreground">
                {game.gameType}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default History;
