import { Close, Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material'
import { useEffect, useState } from 'react'
import * as S from './style'
import { useNavigate } from 'react-router-dom'
import url from '../../../../url'
import axios from 'axios'
import useSignIn from 'react-auth-kit/hooks/useSignIn'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import FormError from '../../../components/General/FormError'

const initialValues = {
  email: '',
  password: '',
}

const errorMes = {
  email: 'Epasta lauks nav aizpildīts',
  password: 'Paroles lauks nav aizpildīts',
  wrong: 'Nepareizs epasts / parole',
  error: 'Servera problēma',
  notAccepted: 'Jūsu konts vēl nav apstiprināts',
}

const Login = () => {
  const signIn = useSignIn()
  const auth = useAuthUser()
  const isAuthenticated = useIsAuthenticated()
  const [form, setForm] = useState(initialValues)
  const [showPassword, setShowPassword] = useState(false)
  const [problems, setProblems] = useState([])
  const [problem, setProblem] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const nav = useNavigate()

  //Ja lietotājs ir ielogojies, tad lietotājs tiek aizvests atpakaļ uz sava lietotāja tipa sākuma lapu
  useEffect(() => {
    if (isAuthenticated) {
      if (auth.userType == 0) {
        nav('/user/tasks')
      } else if (auth.userType == 1) {
        nav('/teacher/students')
      }
    }
  }, [])

  const handleClickShowPassword = () =>
    setShowPassword((showPassword) => !showPassword)

  const setResponse = (res) => {
    setProblem(errorMes[res])
    setProblems((prev) => prev.concat(res))
    setTimeout(() => setProblems([]), 1500)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsPending(true)

    let isAnyElEmpty = false
    for (const [key, value] of Object.entries(form).reverse()) {
      if (!value) {
        isAnyElEmpty = true
        setResponse(key)
      }
    }

    if (!isAnyElEmpty) {
      try {
        const res = await axios.post(`${url}auth/login`, form)
        if (res.data.accessToken) {
          if (
            signIn({
              auth: {
                token: res.data.accessToken,
              },
              userState: {
                userType: res.data.userType,
                userID: res.data.userID,
              },
            })
          ) {
            if (res.data.userType == 0) {
              nav('/user/tasks')
            } else if (res.data.userType == 1) {
              nav('/teacher/students')
            }
          }
        } else if (res.data.userType == 0) {
          setResponse('notAccepted')
        } else if (res.data.problem) {
          setResponse('wrong')
        }
      } catch (err) {
        setResponse('error')
      }
    }

    setIsPending(false)
  }

  const handleFormInputChange = (e) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value,
    })
  }

  return (
    <S.box>
      <S.LoginBox>
        <S.StyledPaper>
          <S.Form onSubmit={handleFormSubmit}>
            <S.h1>Autorizēties</S.h1>
            <FormError text={problem} mb={'1rem'} />

            <S.textField
              label='E-pasts'
              variant='standard'
              type='email'
              name='email'
              value={form.email}
              onChange={handleFormInputChange}
              required
              error={problems.includes('wrong') || problems.includes('email')}
              autoComplete='email'
            />

            <S.textField
              label='Parole'
              variant='standard'
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              name='password'
              value={form.password}
              onChange={handleFormInputChange}
              required
              error={
                problems.includes('wrong') || problems.includes('password')
              }
              autoComplete='current-password'
            />

            <S.button
              variant='contained'
              type='submit'
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
  )
}

export default Login
