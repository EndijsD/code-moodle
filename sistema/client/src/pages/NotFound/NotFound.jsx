import { Box, Button } from '@mui/material';
import * as S from './style';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <S.Content>
      <S.MainBox>
        <h1>Lapa netika atrasta!</h1>
        <Link>
          <Button sx={{ fontWeight: 'bold' }}>Atpakaļ uz sākumlapu</Button>
        </Link>
      </S.MainBox>
    </S.Content>
  );
};

export default NotFound;
