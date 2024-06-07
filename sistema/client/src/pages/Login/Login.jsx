import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useState } from 'react';
import * as S from './style';
import { useNavigate } from 'react-router-dom';
import url from '../../../url';
import axios from 'axios';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

const initialValues = {
  email: '',
  password: '',
};

const Login = () => {
  const signIn = useSignIn();
  const [formValues, setFormValues] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [problem, setProblem] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const nav = useNavigate();

  const isAuthenticated = useIsAuthenticated();

  const handleClickShowPassword = () =>
    setShowPassword((showPassword) => !showPassword);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    //Tiek pārbaudīts vai ievadlauki nav tukši
    if (formValues.email !== '' && formValues.password !== '') {
      //Tiek izveidota nosūtāmā informācija (Parole tiek šifrēta un tad tā tiek salīdzināta ar paroli servera pusē)
      const authInfo = {
        table: 'students',
        email: formValues.email,
        password: formValues.password,
      };

      try {
        //Dati tiek nosūtīti uz servera pusi
        const res = await axios.post(`${url}auth/login`, authInfo);
        //Ja serveris atgriež token un lietotāja id tad lietotājs tiek ielogots (yet to be done)
        if (res.data.accessToken !== undefined) {
          if (
            signIn({
              auth: {
                token: res.data.accessToken,
              },
              userState: {
                tips: res.data.userType,
              },
            })
          ) {
            if (res.data.userType == 0) {
              nav('/userpage');
            } else {
              nav('/adminpage');
            }
          } else {
          }
        } else {
          setProblem(true);
          setIsPending(false);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      setIsPending(false);
      setProblem(true);
    }
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <S.box>
      <S.LoginBox>
        <S.StyledPaper>
          <S.Form onSubmit={handleFormSubmit}>
            <S.h1>Autorizēties</S.h1>

            <S.textField
              label="E-pasts"
              variant="standard"
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleFormInputChange}
              required
              error={problem == 'wrong' && true}
              autoComplete="true"
            />

            <S.textField
              label="Parole"
              variant="standard"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              name="password"
              value={formValues.password}
              onChange={handleFormInputChange}
              required
              error={problem == 'wrong' && true}
              autoComplete="true"
            />

            <S.button
              variant="contained"
              type="submit"
              color={problem == 'error' && !isPending ? 'error' : 'primary'}
              disabled={isPending}
            >
              {isPending ? <CircularProgress size={24.5} /> : <>Pievienoties</>}
            </S.button>

            <Button
              sx={{
                mt: '1rem',
                alignSelf: 'center',
              }}
              onClick={() => nav('/register')}
            >
              Nav konts? Reģistrējies
            </Button>
          </S.Form>
        </S.StyledPaper>
      </S.LoginBox>
    </S.box>
  );
};

export default Login;
