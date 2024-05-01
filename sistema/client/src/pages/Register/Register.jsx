import { Check, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import * as S from "./style";
// import url from "../../url";
import { useNavigate } from "react-router-dom";

const initialUserValues = {
  vards: "",
  uzvards: "",
  skola: "",
  klase: "",
  epasts: "",
  parole: "",
  parole_atk: "",
};

const Register = () => {
  const [userValues, setUserValues] = useState(initialUserValues);
  const [showPassword, setShowPassword] = useState([false, false]);
  const [problems, setProblems] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const nav = useNavigate();
  const [active, setActive] = useState([false, false]);

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

            <S.InputField
              label="Skola"
              variant="standard"
              name="skola"
              value={userValues.skola}
              onChange={handleFormInputChange}
              error={problems.includes("adr") && !userValues.skola}
              autoComplete="true"
              inputProps={{
                maxLength: 60,
              }}
            />

            <S.InputField
              label="Klase"
              variant="standard"
              name="klase"
              value={userValues.klase}
              onChange={handleFormInputChange}
              error={problems.includes("adr") && !userValues.klase}
              autoComplete="true"
              inputProps={{
                maxLength: 60,
              }}
            />

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
              type={showPassword[0] ? "text" : "password"}
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
                pattern: "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}",
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
                ".MuiFormHelperText-root": {
                  visibility: active[0] ? "" : "hidden",
                },
                mb: -2,
              }}
              helperText={
                "8 rakstzīmes, kur ir vismaz 1 lielais, mazais burts un cipars"
              }
              name="parole"
              value={userValues.parole}
              onChange={handleFormInputChange}
              required
              error={problems.includes("pass")}
              autoComplete="true"
            />

            <S.InputField
              label="Parole atkārtoti"
              variant="standard"
              type={showPassword[1] ? "text" : "password"}
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
                pattern: "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}",
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
                ".MuiFormHelperText-root": {
                  visibility: active[1] ? "" : "hidden",
                },
                mb: -2,
              }}
              helperText={
                "8 rakstzīmes, kur ir vismaz 1 lielais, mazais burts un cipars"
              }
              name="parole_atk"
              value={userValues.parole_atk}
              onChange={handleFormInputChange}
              required
              error={problems.includes("pass")}
              autoComplete="true"
            />
          </S.StyledBox>

          <S.ButtonBox>
            <S.SubmitButton
              variant="contained"
              type={success ? undefined : "submit"}
              color={
                problems.includes("error") && !isPending
                  ? "error"
                  : success
                  ? "success"
                  : "primary"
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
                alignSelf: "center",
              }}
              onClick={() => nav("/login")}
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
