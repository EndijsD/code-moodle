import * as S from './style';
import { Link } from 'react-router-dom';

const NotFound = ({ link }) => {
  return (
    <S.Content>
      <S.MainBox>
        <S.H1>Lapa netika atrasta!</S.H1>
        <Link to={link}>
          <S.ToLandingButton>Atpakaļ uz sākumlapu</S.ToLandingButton>
        </Link>
      </S.MainBox>
    </S.Content>
  );
};

export default NotFound;
