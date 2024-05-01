import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import * as S from "./style";
import { useNavigate } from "react-router-dom";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const [formValues, setFormValues] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [problem, setProblem] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const nav = useNavigate();

  const handleClickShowPassword = () =>
    setShowPassword((showPassword) => !showPassword);

  const handleFormSubmit = (e) => {
    e.preventDefault();
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
              error={problem == "wrong" && true}
              autoComplete="true"
            />

            <S.textField
              label="Parole"
              variant="standard"
              type={showPassword ? "text" : "password"}
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
              error={problem == "wrong" && true}
              autoComplete="true"
            />

            <S.button
              variant="contained"
              type="submit"
              color={problem == "error" && !isPending ? "error" : "primary"}
              disabled={isPending}
            >
              {isPending ? <CircularProgress /> : <>Pievienoties</>}
            </S.button>

            <Button
              sx={{
                borderRadius: 50,
                mt: "1rem",
                maxWidth: 220,
                alignSelf: "center",
              }}
              onClick={() => nav("/register")}
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
