import QuizCreation from '@/components/QuizCreation';
import { getAuthSession } from '@/lib/nextAuth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Quiz | Smarty Quiz',
};

type Props = {};

const QuizPage = async (props: Props) => {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect('/');
  }

  return <QuizCreation />;
};
export default QuizPage;
