import axios from 'axios';
import History from '../History';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

type Props = { userId: string };
const RecentAcitivityCard = async ({ userId }: Props) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_API}/api/history`,
    { limit: 10, userId }
  );

  const games = await res.data.history;

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recent Activities</CardTitle>
        <CardDescription>
          You have played a total of {games.length} games
        </CardDescription>
      </CardHeader>
      <CardContent>
        <History limit={10} userId={userId} />
      </CardContent>
    </Card>
  );
};
export default RecentAcitivityCard;
