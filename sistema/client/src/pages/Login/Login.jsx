import { Close, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useEffect, useState } from 'react';
import * as S from './style';
import { useNavigate } from 'react-router-dom';
import url from '../../../url';
import axios from 'axios';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const initialValues = {
  email: '',
  password: '',
};

const Login = () => {
  const signIn = useSignIn();
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const [formValues, setFormValues] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [problems, setProblems] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const nav = useNavigate();

  //Ja lietotājs ir ielogojies, tad lietotājs tiek aizvests atpakaļ uz sava lietotāja tipa sākuma lapu
  useEffect(() => {
    if (isAuthenticated) {
      if (auth.userType == 0) {
        nav('/userpage');
      } else if (auth.userType == 1) {
        nav('/adminpage');
      }
    }
  }, []);

  const handleClickShowPassword = () =>
    setShowPassword((showPassword) => !showPassword);

  const setResponse = (res) => {
    setProblems((prev) => prev.concat(res));
    setTimeout(() => setProblems([]), 1500);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    //Tiek pārbaudīts vai ievadlauki nav tukši
    let isAnyElEmpty = false;
    for (const [key, value] of Object.entries(formValues)) {
      if (!value) {
        isAnyElEmpty = true;
        setResponse(key);
      }
    }

    if (!isAnyElEmpty) {
      //Tiek izveidota nosūtāmā informācija (Parole tiek šifrēta un tad tā tiek salīdzināta ar paroli servera pusē)
      const authInfo = {
        email: formValues.email,
        password: formValues.password,
      };

      try {
        //Dati tiek nosūtīti uz servera pusi
        const res = await axios.post(`${url}auth/login`, authInfo);
        if (res.data.accessToken !== undefined) {
          if (
            signIn({
              auth: {
                token: res.data.accessToken,
              },
              userState: {
                userType: res.data.userType,
              },
            })
          ) {
            if (res.data.userType == 0) {
              nav('/userpage');
            } else if (res.data.userType == 1) {
              nav('/adminpage');
            }
          }
        } else if (res.data.problem) {
          setResponse('wrong');
        }
      } catch (err) {
        setResponse('error');
      }
    }

    setIsPending(false);
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
              error={problems.includes('wrong') || problems.includes('email')}
              autoComplete="email"
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
              error={
                problems.includes('wrong') || problems.includes('password')
              }
              autoComplete="current-password"
            />

            <S.button
              variant="contained"
              type="submit"
              color={
                problems.includes('error') && !isPending ? 'error' : 'primary'
              }
              disabled={isPending}
            >
              {isPending ? (
                <CircularProgress size={24.5} />
              ) : problems.includes('error') ? (
                <Close />
              ) : (
                <>Pievienoties</>
              )}
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
