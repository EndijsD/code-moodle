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
import { errorMes, initialFormValues } from '../../../data/General/RegisterData'
import { useGlobalContext } from '../../../context/GlobalProvider'

const Register = () => {
  const nav = useNavigate()
  const [formValues, setFormValues] = useState(initialFormValues)
  const [showPassword, setShowPassword] = useState([false, false])
  const [problems, setProblems] = useState([])
  const [problem, setProblem] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [active, setActive] = useState([false, false])
  const [schools, setSchools] = useState([])
  const [classes, setClasses] = useState([[]])
  const { user, initialized } = useGlobalContext()

  // Ja lietotājs ir ielogojies, tad lietotājs tiek aizvests atpakaļ uz sava lietotāja tipa sākuma lapu
  useEffect(() => {
    if (user) {
      if (user.loma == 'students') nav('/user/tasks')
      else if (user.loma == 'skolotajs') nav('/teacher/students')
    }
  }, [user])

  if (!initialized || user) return

  const setResponse = (res, withTimeout = true) => {
    if (res == 'suc') {
      setSuccess(true)
      setTimeout(() => nav('/login'), 1500)
    } else {
      setProblem(errorMes[res])
      setProblems((prev) => prev.concat(res))
      if (withTimeout) setTimeout(() => setProblems([]), 1500)
    }
  }

  useEffect(() => {
    setIsPending(true)
    axios
      .get(`skolas`)
      .then((res) => setSchools(res.data))
      .catch(() => setResponse('permError', false))
    setIsPending(false)
  }, [])

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setIsPending(true)

    let isAnyElEmpty = false
    for (const [key, value] of Object.entries(formValues).reverse()) {
      if (!value) {
        isAnyElEmpty = true
        setResponse(key)
      }
    }

    if (!isAnyElEmpty)
      if (formValues.parole == formValues.parole_atk) {
        const postData = { ...formValues }
        delete postData.parole_atk
        axios
          .post(`studenti`, postData)
          .then(() => setResponse('suc'))
          .catch(() => setResponse('error'))
      } else setResponse('pass')

    setIsPending(false)
  }

  const updateClasses = (schoolID) => {
    let type
    for (let i = 0; i < schools.length; i++)
      if (schools[i].skolas_id == schoolID) {
        type = schools[i].tips
        break
      }

    let range = [1]
    let endText = 'klase'
    switch (type) {
      case 'Pamatskola':
        range.push(9)
        break
      case 'Vidusskola':
        range = [10, 12]
        break
      case 'Tehnikums':
        range.push(4)
        endText = 'kurss'
        break
      case 'Ģimnāzija':
        range.push(12)
        break
      case 'Augstskola':
        endText = 'kurss'
        range.push(6)
    }

    let fullArr = []
    for (let i = range[0]; i <= range[1]; i++) fullArr.push(i)

    setClasses([fullArr, endText])
  }

  const handleClickShowPassword = (index) => {
    setShowPassword((showPassword) =>
      showPassword.map((value, i) => (i == index ? !value : value))
    )
  }

  const handleFormInputChange = (e) => {
    const { name, value } = e.target

    if (name == 'skolas_id') {
      setFormValues({
        ...formValues,
        [name]: value,
        klase: '',
      })
      updateClasses(value)
    } else
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

            <FormControl
              sx={S.FormControlSx}
              variant='standard'
              disabled={!schools.length}
              required
              error={problems.includes('skolas_id')}
            >
              <InputLabel htmlFor='school'>Skola</InputLabel>
              <Select
                name='skolas_id'
                value={formValues.skolas_id}
                inputProps={{ id: 'school' }}
                onChange={handleFormInputChange}
              >
                {schools.map((school, i) => (
                  <MenuItem key={i} value={school.skolas_id}>
                    {school.nosaukums}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              sx={S.FormControlSx}
              variant='standard'
              disabled={!classes[0].length}
              required
              error={problems.includes('klase')}
            >
              <InputLabel htmlFor='class'>Klase/Kurss</InputLabel>
              <Select
                name='klase'
                inputProps={{ id: 'class' }}
                value={formValues.klase}
                onChange={handleFormInputChange}
              >
                {classes[0].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num + '. ' + classes[1]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
                maxLength: 100,
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
                pattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}',
                maxLength: 256,
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
                pattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}',
                maxLength: 256,
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

export default Register
