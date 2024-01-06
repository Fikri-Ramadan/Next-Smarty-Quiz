import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import CustomWordCloud from '../CustomWordCloud';
import axios from 'axios';
import { TopicCount } from '@prisma/client';

type Props = {};
const HotTopicsCard = async (props: Props) => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API}/api/topics`);
  const topics: TopicCount[] = await res.data.topics;
  const formattedTopics = topics.map((topic) => {
    return {
      text: topic.topic,
      value: topic.count,
    };
  });

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="font-bold text-2xl">Hot Topics</CardTitle>
        <CardDescription>
          Click on a topic to start a quiz on it!
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <CustomWordCloud formattedTopics={formattedTopics} />
      </CardContent>
    </Card>
  );
};
export default HotTopicsCard;
