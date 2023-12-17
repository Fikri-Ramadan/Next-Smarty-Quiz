'use client';

import { useTheme } from 'next-themes';
import WordCloud from 'react-d3-cloud';

type Props = {};

const data = [
  { text: 'NextJS', value: 16 },
  { text: 'Spring Boot', value: 32 },
  { text: 'ReactJS', value: 4 },
  { text: 'ExpressJS', value: 6 },
  { text: 'Typescript', value: 102 },
  { text: 'NextJS', value: 16 },
  { text: 'Spring Boot', value: 32 },
  { text: 'ReactJS', value: 4 },
  { text: 'ExpressJS', value: 6 },
  { text: 'Typescript', value: 102 },
  { text: 'NextJS', value: 16 },
  { text: 'Spring Boot', value: 32 },
  { text: 'ReactJS', value: 4 },
  { text: 'ExpressJS', value: 6 },
  { text: 'Typescript', value: 102 },
];

const fontSizeMapper = (word: { value: number }) => {
  return Math.log2(word.value) * 5 + 16;
};

const CustomWordCloud = (props: Props) => {
  const theme = useTheme();

  return (
    <>
      <WordCloud
        data={data}
        height={550}
        font={'Times'}
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme.theme === 'dark' ? 'white' : 'black'}
      />
    </>
  );
};

export default CustomWordCloud;
