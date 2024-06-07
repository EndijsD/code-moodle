import * as S from './style';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <S.Content>
      <S.MainBox>
        <S.H1>Lapa netika atrasta!</S.H1>
        <Link>
          <S.ToLandingButton>Atpakaļ uz sākumlapu</S.ToLandingButton>
        </Link>
      </S.MainBox>
    </S.Content>
  );
};

export default NotFound;
