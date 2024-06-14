import * as S from './style';

const FormError = ({ text, mb = 0 }) => {
  return text && <S.Error marginBottom={mb}>{text}</S.Error>;
};

export default FormError;
