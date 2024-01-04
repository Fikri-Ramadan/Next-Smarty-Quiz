import { Question } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

type Props = {
  questions: Question[];
};

const QuestionList = ({ questions }: Props) => {
  return (
    <Table className="mt-4">
      <TableCaption>End of list.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[10px]">No.</TableHead>
          <TableHead>Question & correct answer</TableHead>
          <TableHead>Your answer</TableHead>
          {questions[0].questionType === 'open_ended' && (
            <TableHead className="w-[10px] text-right">Accuracy</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        <>
          {questions.map((question, index) => {
            return (
              <TableRow key={index}>
                <TableCell className="font-medium flex justify-start items-start">
                  {index + 1}
                </TableCell>
                <TableCell>
                  {question.question}
                  <br /> <br />
                  <span className="font-semibold">{question.answer}</span>
                </TableCell>
                {question.questionType === 'open_ended' ? (
                  <TableCell className="font-bold">
                    {question.userAnswer}
                  </TableCell>
                ) : (
                  <TableCell
                    className={`${
                      question.isCorrect ? 'text-green-600' : 'text-red-600'
                    } font-semibold`}
                  >
                    {question.userAnswer}
                  </TableCell>
                )}
                {!!question.percentageCorrect && (
                  <TableCell className="text-right">
                    {question.percentageCorrect}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </>
      </TableBody>
    </Table>
  );
};

export default QuestionList;
