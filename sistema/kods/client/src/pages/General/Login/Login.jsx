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
import axios from 'axios'
import FormError from '../../../components/General/FormError'
import { errorMes, initialValues } from '../../../data/General/LoginData'
import { useGlobalContext } from '../../../context/GlobalProvider'

const Login = () => {
  const [form, setForm] = useState(initialValues)
  const [showPassword, setShowPassword] = useState(false)
  const [problems, setProblems] = useState([])
  const [problem, setProblem] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const nav = useNavigate()
  const { user, setUser, initialized } = useGlobalContext()

  // Ja lietotājs ir ielogojies, tad lietotājs tiek aizvests atpakaļ uz sava lietotāja tipa sākuma lapu
  useEffect(() => {
    if (user) {
      if (user.loma == 'students') nav('/student/modules')
      else if (user.loma == 'skolotajs') nav('/teacher/students')
    }
  }, [user])

  if (!initialized || user) return

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
        const res = await axios.post(`auth/login`, form)

        if (String(res.status).charAt(0) == '2') {
          setUser(res.data)
          if (res.data.loma == 'students') nav('/student/modules')
          else if (res.data.loma == 'skolotajs') nav('/teacher/students')
          else if (res.data.loma === 'administrators') nav('/admin/teachers')
        }
      } catch (err) {
        if (err.response?.status === 403) setResponse('wrong')
        else setResponse('error')
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

            <Button sx={S.ButtonSx} onClick={() => nav('/register')}>
              Nav konts? Reģistrējies
            </Button>
          </S.Form>
        </S.StyledPaper>
      </S.LoginBox>
    </S.box>
  )
}

export default Login
