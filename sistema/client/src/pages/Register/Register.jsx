import { Check, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useEffect, useState } from 'react';
import * as S from './style';
// import url from "../../url";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import url from '../../../../url';

const initialUserValues = {
  vards: '',
  uzvards: '',
  skola: 0,
  klase: '',
  epasts: '',
  parole: '',
  parole_atk: '',
};

const Register = () => {
  const nav = useNavigate();
  const [userValues, setUserValues] = useState(initialUserValues);
  const [showPassword, setShowPassword] = useState([false, false]);
  const [problems, setProblems] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [active, setActive] = useState([false, false]);
  const [data, setData] = useState([]);
  const [klases, setKlases] = useState([]);
  const [tips, setTips] = useState('');

  const FetchData = async () => {
    try {
      let res = await axios.get(`${url}skolas`);
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const MakeClasses = () => {
    setKlases([]);
    let max, type;
    switch (tips) {
      case 'Pamatskola':
        max = 9;
        type = 1;
        break;
      case 'Vidusskola':
        max = 12;
        type = 1;
        break;
      case 'Tehnikums':
        max = 4;
        type = 0;
        break;
      case 'Augstskola':
        max = 5;
        type = 0;
        break;
    }
    if (type === 1) {
      for (let i = 1; i < max + 1; i++) {
        setKlases((oldArray) => [...oldArray, `${i}.klase`]);
      }
    } else if (type === 0) {
      for (let i = 1; i < max + 1; i++) {
        setKlases((oldArray) => [...oldArray, `${i}.kurss`]);
      }
    }
  };

  useEffect(() => {
    if (tips != '') {
      MakeClasses();
    }
  }, [tips]);

  useEffect(() => {
    FetchData();
  }, []);

  useEffect(() => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].skolas_id === userValues.skola) {
        setTips(data[i].tips);
        break;
      }
    }
  }, [userValues.skola]);

  const handleClickShowPassword = (index) => {
    setShowPassword((showPassword) =>
      showPassword.map((value, i) => (i == index ? !value : value))
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;

    userValues.hasOwnProperty(name)
      ? setUserValues({
          ...userValues,
          [name]: value,
        })
      : setAddressValues({
          ...addressValues,
          [name]: value,
        });
  };
  return (
    <S.MainBox>
      <S.StyledPaper>
        <S.Form onSubmit={handleFormSubmit}>
          <S.Title>Reģistrēties</S.Title>

          <S.StyledBox>
            <S.InputField
              label="Vārds"
              variant="standard"
              name="vards"
              value={userValues.vards}
              onChange={handleFormInputChange}
              required
              autoComplete="true"
              inputProps={{
                maxLength: 45,
              }}
            />

            <S.InputField
              label="Uzvārds"
              variant="standard"
              name="uzvards"
              value={userValues.uzvards}
              onChange={handleFormInputChange}
              required
              autoComplete="true"
              inputProps={{
                maxLength: 45,
              }}
            />

            <FormControl
              sx={{ width: '80%', alignSelf: 'center' }}
              variant="standard"
            >
              <InputLabel id="skola-label">Skola</InputLabel>
              <Select
                disabled={data.length === 0}
                required
                name="skola"
                labelId="skola-label"
                value={userValues.skola}
                label="Skola"
                onChange={handleFormInputChange}
              >
                <MenuItem
                  selected
                  key={-1}
                  value={0}
                  sx={{ display: 'none' }}
                ></MenuItem>
                {data.map((school, i) => (
                  <MenuItem key={i} value={school.skolas_id}>
                    {school.nosaukums}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              variant="standard"
              sx={{ width: '80%', alignSelf: 'center' }}
              disabled={klases.length === 0}
            >
              <InputLabel id="skola-label">Klase/Kurss</InputLabel>
              <Select
                required
                name="klase"
                labelId="skola-label"
                value={userValues.klase}
                label="Klase/Kurss"
                onChange={handleFormInputChange}
              >
                {klases.map((klases, i) => (
                  <MenuItem key={i} value={i + 1}>
                    {klases}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <S.InputField
              label="E-pasts"
              variant="standard"
              type="email"
              name="epasts"
              value={userValues.epasts}
              onChange={handleFormInputChange}
              required
              autoComplete="true"
              inputProps={{
                maxLength: 100,
              }}
            />

            <S.InputField
              label="Parole"
              variant="standard"
              type={showPassword[0] ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword(0)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword[0] ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                pattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}',
                maxLength: 100,
              }}
              onMouseEnter={() =>
                setActive((prev) =>
                  prev.map((value, i) => (i == 0 ? true : value))
                )
              }
              onMouseLeave={() =>
                setActive((prev) =>
                  prev.map((value, i) => (i == 0 ? false : value))
                )
              }
              sx={{
                '.MuiFormHelperText-root': {
                  visibility: active[0] ? '' : 'hidden',
                },
                mb: -2,
              }}
              helperText={
                '8 rakstzīmes, kur ir vismaz 1 lielais, mazais burts un cipars'
              }
              name="parole"
              value={userValues.parole}
              onChange={handleFormInputChange}
              required
              error={problems.includes('pass')}
              autoComplete="true"
            />

            <S.InputField
              label="Parole atkārtoti"
              variant="standard"
              type={showPassword[1] ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword(1)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword[1] ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                pattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}',
                maxLength: 100,
              }}
              onMouseEnter={() =>
                setActive((prev) =>
                  prev.map((value, i) => (i == 1 ? true : value))
                )
              }
              onMouseLeave={() =>
                setActive((prev) =>
                  prev.map((value, i) => (i == 1 ? false : value))
                )
              }
              sx={{
                '.MuiFormHelperText-root': {
                  visibility: active[1] ? '' : 'hidden',
                },
                mb: -2,
              }}
              helperText={
                '8 rakstzīmes, kur ir vismaz 1 lielais, mazais burts un cipars'
              }
              name="parole_atk"
              value={userValues.parole_atk}
              onChange={handleFormInputChange}
              required
              error={problems.includes('pass')}
              autoComplete="true"
            />
          </S.StyledBox>

          <S.ButtonBox>
            <S.SubmitButton
              variant="contained"
              type={success ? undefined : 'submit'}
              color={
                problems.includes('error') && !isPending
                  ? 'error'
                  : success
                  ? 'success'
                  : 'primary'
              }
              disabled={isPending}
            >
              {isPending ? (
                <CircularProgress />
              ) : success ? (
                <Check />
              ) : (
                <>Pievienoties</>
              )}
            </S.SubmitButton>

            <Button
              sx={{
                borderRadius: 50,
                maxWidth: 220,
                alignSelf: 'center',
              }}
              onClick={() => nav('/login')}
            >
              Ir konts? Autorizējies
            </Button>
          </S.ButtonBox>
        </S.Form>
      </S.StyledPaper>
    </S.MainBox>
  );
};

export default Register;
