import { Close, Check, Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { useEffect, useState } from 'react'
import * as S from './style'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import FormError from '../../../components/General/FormError'
import { errorMes } from '../../../data/General/RegisterData'
import { useGlobalContext } from '../../../context/GlobalProvider'

const initialFormValues = {
  vards: '',
  uzvards: '',
  epasts: '',
  parole: '',
  parole_atk: '',
  nosaukums: '',
  tips: '',
}

const schoolTypes = [
  'Augstskola',
  'Pamatskola',
  'Vidusskola',
  'Tehnikums',
  'Ģimnāzija',
  'Cits',
]

const RegisterAdministrator = () => {
  const nav = useNavigate()
  const [formValues, setFormValues] = useState(initialFormValues)
  const [showPassword, setShowPassword] = useState([false, false])
  const [problems, setProblems] = useState([])
  const [problem, setProblem] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [active, setActive] = useState([false, false])
  const { user, initialized } = useGlobalContext()

  // Ja lietotājs ir ielogojies, tad lietotājs tiek aizvests atpakaļ uz sava lietotāja tipa sākuma lapu
  useEffect(() => {
    if (user) {
      if (user.loma == 'students') nav('/student/modules')
      else if (user.loma == 'skolotajs') nav('/teacher/students')
    }
  }, [user])

  if (!initialized || user) return

  const handleResponse = (res, withTimeout = true) => {
    if (res == 'suc') {
      setSuccess(true)
      setTimeout(() => nav('/login'), 1500)
    } else {
      setProblem(errorMes[res])
      setProblems((prev) => prev.concat(res))
      if (withTimeout) setTimeout(() => setProblems([]), 1500)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsPending(true)

    let hasProblems = false
    for (const [key, value] of Object.entries(formValues).reverse()) {
      if (!value) {
        handleResponse(key)
        hasProblems = true
      }
    }

    if (hasProblems) {
      setIsPending(false)
      return
    }

    if (formValues.parole == formValues.parole_atk) {
      const postData = { ...formValues }
      const schoolInfo = {
        nosaukums: postData.nosaukums,
        tips: postData.tips == 'Cits' ? '-' : postData.tips,
      }
      delete postData.nosaukums
      delete postData.tips
      delete postData.parole_atk

      try {
        const res = await axios.post('skolas', schoolInfo)
        const res2 = await axios.post('lietotajs', {
          ...postData,
          loma: 'administrators',
        })

        await axios.post('administrators', {
          skolas_id: res.data.id,
          lietotajs_id: res2.data.id,
        })

        handleResponse('suc')
      } catch (error) {
        handleResponse('error')
      } finally {
        setIsPending(false)
      }

      // axios
      //   .post('lietotajs', { ...postData, loma: 'administrators' })
      //   .then((res) => {
      //     axios
      //       .post('administrators', {
      //         skolas_id: schoolInfo.skolas_id,
      //         lietotajs_id: res.data.id,
      //       })
      //       .then(() => handleResponse('suc'))
      //       .catch(() => handleResponse('error'))
      //       .finally(() => setIsPending(false))
      //   })
      //   .catch(() => handleResponse('error'))
    } else {
      handleResponse('pass')
      setIsPending(false)
    }
  }

  const handleClickShowPassword = (index) => {
    setShowPassword((showPassword) =>
      showPassword.map((value, i) => (i == index ? !value : value))
    )
  }

  const handleFormInputChange = (e) => {
    const { name, value } = e.target

    setFormValues({
      ...formValues,
      [name]: value,
    })
  }

  return (
    <S.MainBox>
      <S.StyledPaper>
        <S.Form onSubmit={handleFormSubmit}>
          <S.Title>Reģistrēties</S.Title>

          <S.StyledBox>
            <FormError text={problem} />

            <S.InputField
              label='Vārds'
              variant='standard'
              name='vards'
              value={formValues.vards}
              onChange={handleFormInputChange}
              required
              autoComplete='given-name'
              inputProps={{
                maxLength: 45,
              }}
              error={problems.includes('vards')}
            />

            <S.InputField
              label='Uzvārds'
              variant='standard'
              name='uzvards'
              value={formValues.uzvards}
              onChange={handleFormInputChange}
              required
              autoComplete='family-name'
              inputProps={{
                maxLength: 45,
              }}
              error={problems.includes('uzvards')}
            />

            <S.InputField
              label='E-pasts'
              variant='standard'
              type='email'
              name='epasts'
              value={formValues.epasts}
              onChange={handleFormInputChange}
              required
              error={problems.includes('epasts')}
              autoComplete='email'
              inputProps={{
                maxLength: 255,
              }}
            />

            <S.InputField
              label='Parole'
              variant='standard'
              type={showPassword[0] ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
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
                // pattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}',
                maxLength: 255,
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
              name='parole'
              value={formValues.parole}
              onChange={handleFormInputChange}
              required
              error={problems.includes('pass') || problems.includes('parole')}
              autoComplete='new-password'
            />

            <S.InputField
              label='Parole atkārtoti'
              variant='standard'
              type={showPassword[1] ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
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
                // pattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}',
                maxLength: 255,
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
              name='parole_atk'
              value={formValues.parole_atk}
              onChange={handleFormInputChange}
              required
              error={
                problems.includes('pass') || problems.includes('parole_atk')
              }
              autoComplete='new-password'
            />

            <S.InputField
              label='Skolas nosaukums'
              variant='standard'
              name='nosaukums'
              value={formValues.nosaukums}
              onChange={handleFormInputChange}
              required
              error={problems.includes('nosaukums')}
              inputProps={{
                maxLength: 100,
              }}
            />

            <FormControl
              sx={S.FormControlSx}
              variant='standard'
              required
              error={problems.includes('tips')}
            >
              <InputLabel htmlFor='school'>Skolas veids</InputLabel>
              <Select
                name='tips'
                value={formValues.tips}
                inputProps={{ id: 'school' }}
                onChange={handleFormInputChange}
              >
                {schoolTypes.map((type, i) => (
                  <MenuItem key={i} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </S.StyledBox>

          <S.ButtonBox>
            <S.SubmitButton
              variant='contained'
              type={
                success || problems.includes('permError') ? undefined : 'submit'
              }
              color={
                problems.some((el) => ['error', 'permError'].includes(el)) &&
                !isPending
                  ? 'error'
                  : success
                  ? 'success'
                  : 'primary'
              }
              disabled={isPending}
            >
              {isPending ? (
                <CircularProgress size={24.5} />
              ) : success ? (
                <Check />
              ) : problems.some((el) => ['error', 'permError'].includes(el)) ? (
                <Close />
              ) : (
                <>Pievienoties</>
              )}
            </S.SubmitButton>

            <Button
              sx={{
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
  )
}

export default RegisterAdministrator
