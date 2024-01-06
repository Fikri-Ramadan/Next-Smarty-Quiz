'use client';

import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import D3WordCloud from 'react-d3-cloud';

type Props = {
  formattedTopics: {
    text: string;
    value: number;
  }[];
};

const fontSizeMapper = (word: { value: number }) => {
  return Math.log2(word.value) * 5 + 16;
};

const CustomWordCloud = ({ formattedTopics }: Props) => {
  const theme = useTheme();
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== undefined) {
      setLoading(false);
    }
  }, []);

  if (isLoading) {
    return <>Loading...</>;
  }
  return (
    <>
      <D3WordCloud
        data={formattedTopics}
        height={550}
        font="Times"
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme.theme === 'dark' ? 'white' : 'black'}
        onWordClick={(e, d) => {
          router.push('/quiz?topic=' + d.text);
        }}
      />
    </>
  );
};

export default CustomWordCloud;
