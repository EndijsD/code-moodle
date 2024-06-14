import * as S from './style';

const Title = ({ text }) => {
  return (
    <S.Title variant="h3" sx={{ mb: 4 }}>
      {text}
    </S.Title>
  );
};

export default Title;
