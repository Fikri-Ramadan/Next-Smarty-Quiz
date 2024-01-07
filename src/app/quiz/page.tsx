import QuizCreation from '@/components/QuizCreation';
import { getAuthSession } from '@/lib/nextAuth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Quiz | Smarty Quiz',
};

type Props = {
  searchParams: {
    topic?: string;
  };
};

const QuizPage = async ({ searchParams: { topic } }: Props) => {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect('/');
  }

  return <QuizCreation topicParams={topic || ''} userId={session.user.id} />;
};
export default QuizPage;
