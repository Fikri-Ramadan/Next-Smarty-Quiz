'use client';

import { Dispatch, Fragment, SetStateAction, useMemo } from 'react';
import keywordExtractor from 'keyword-extractor';

type Props = {
  answer: string;
  setBlankAnswer: Dispatch<SetStateAction<string>>;
};

const BLANK = '_____';

const BlankInputAnswer = ({ answer, setBlankAnswer }: Props) => {
  const keywords = useMemo(() => {
    const words = keywordExtractor.extract(answer, {
      language: 'english',
      remove_digits: true,
      remove_duplicates: false,
      return_changed_case: false,
    });

    // mix words
    const shuffled = words.sort(() => Math.random() - 0.5);

    return shuffled.slice(0, 2);
  }, [answer]);

  const answerWithBlanks = useMemo(() => {
    const answerWithBlanks = keywords.reduce((acc, curr) => {
      return acc.replaceAll(curr, BLANK);
    }, answer);

    setBlankAnswer(answerWithBlanks);

    return answerWithBlanks;
  }, [keywords, answer, setBlankAnswer]);

  return (
    <div className="flex flex-row justify-start w-full mb-4">
      <div className="text-xl font-semibold">
        {answerWithBlanks.split(BLANK).map((word, index) => {
          return (
            <Fragment key={index}>
              {word}
              {index === answerWithBlanks.split(BLANK).length - 1 ? (
                ''
              ) : (
                <input
                  id="user-blank-input"
                  className="text-center border-b-2 border-black dark:border-white w-28 focus:border-2 focus:border-b-4 focus:outline-none"
                  type="text"
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default BlankInputAnswer;
