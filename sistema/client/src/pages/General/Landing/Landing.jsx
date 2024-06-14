import { Box, Divider } from '@mui/material';
import * as S from './style';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <>
      <S.HeadingBox>
        <S.H1>Code Moodle</S.H1>
      </S.HeadingBox>
      <S.Content>
        <S.StyledPaper>
          <S.LeftBox>
            <Link to="login">
              <S.MainButton>Pieslēgties</S.MainButton>
            </Link>
            <Link to="register">
              <S.MainButton>Rēģistrēties</S.MainButton>
            </Link>
          </S.LeftBox>
          <Divider orientation="vertical" flexItem />
          <Box>
            <h2>Par vietni</h2>
            <S.Paragraph>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
              sed iure quod cum itaque, commodi mollitia perspiciatis eum id,
              fuga quos repellat ut voluptate molestias vitae. Possimus porro
              facilis iusto!
            </S.Paragraph>
          </Box>
        </S.StyledPaper>
      </S.Content>
    </>
  );
};

export default Landing;
