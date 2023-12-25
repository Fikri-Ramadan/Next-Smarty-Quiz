type Props = {
  params: {
    gameId: string;
  };
};

const OpenEndedPage = ({ params: { gameId } }: Props) => {
  return <div>{gameId}</div>;
};

export default OpenEndedPage;
