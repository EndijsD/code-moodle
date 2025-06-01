import { Close, Check, Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
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
import Spinner from '../../../components/General/Spinner/Spinner'

const initialFormValues = {
  vards: '',
  uzvards: '',
  skolas_id: '',
  klase: '',
  epasts: '',
  parole: '',
  parole_atk: '',
}

const RegisterStudent = () => {
  const nav = useNavigate()
  const [formValues, setFormValues] = useState(initialFormValues)
  const [showPassword, setShowPassword] = useState([false, false])
  const [problems, setProblems] = useState([])
  const [problem, setProblem] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [isSchoolPending, setIsSchoolPending] = useState(true)
  const [success, setSuccess] = useState(false)
  const [active, setActive] = useState([false, false])
  const [schools, setSchools] = useState([])
  const [classes, setClasses] = useState({ arr: [], endText: '' })
  const { user, initialized } = useGlobalContext()
  const [isSchoolChecked, setIsSchoolChecked] = useState(true)

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

  useEffect(() => {
    setIsSchoolPending(true)

    axios
      .get(`skolas`)
      .then((res) =>
        setSchools(res.data ? res.data.filter((el) => el.tips != '-') : [])
      )
      .catch(() => handleResponse('permError', false))
      .finally(() => setIsSchoolPending(false))
  }, [])

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setIsPending(true)

    let hasProblems = false
    for (const [key, value] of Object.entries(formValues).reverse()) {
      if (!isSchoolChecked && ['skolas_id', 'klase'].includes(key)) continue

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
        skolas_id: postData.skolas_id,
        klase: postData.klase,
      }
      delete postData.parole_atk
      delete postData.klase
      delete postData.skolas_id

      axios
        .post('lietotajs', { ...postData, loma: 'students' })
        .then((res) => {
          axios
            .post('studenti', {
              ...(isSchoolChecked ? schoolInfo : { skolas_id: 7 }),
              lietotajs_id: res.data.id,
            })
            .then(() => handleResponse('suc'))
            .catch(() => handleResponse('error'))
            .finally(() => setIsPending(false))
        })
        .catch(() => handleResponse('error'))
    } else {
      handleResponse('pass')
      setIsPending(false)
    }
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

    let arr = []
    for (let i = range[0]; i <= range[1]; i++) arr.push(i)

    setClasses({ arr, endText })
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

  const handleChange = (event) => {
    setIsSchoolChecked(event.target.checked)

    if (!event.target.checked) {
      setFormValues({
        ...formValues,
        skolas_id: '',
        klase: '',
      })
      setClasses({ arr: [], endText: '' })
    }
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

            <FormControlLabel
              control={
                <Checkbox checked={isSchoolChecked} onChange={handleChange} />
              }
              label={'Es mācos skolā'}
            />

            {isSchoolChecked &&
              (isSchoolPending ? (
                <Spinner />
              ) : schools && schools.length > 0 ? (
                <>
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
                    disabled={!classes.arr.length}
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
                      {classes.arr.map((num) => (
                        <MenuItem key={num} value={num}>
                          {num + '. ' + classes.endText}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              ) : (
                <S.SubTitle>Neviena skola nav pieteikusies sistēmai</S.SubTitle>
              ))}
          </S.StyledBox>

          <S.ButtonBox>
            <S.SubmitButton
              variant='contained'
              type={
                success || problems.includes('permError') ? undefined : 'submit'
              }
              color={
                problems.some((el) => ['error', 'permError'].includes(el)) &&
                !isPending &&
                !isSchoolPending
                  ? 'error'
                  : success
                  ? 'success'
                  : 'primary'
              }
              disabled={isPending || isSchoolPending}
            >
              {isPending || isSchoolPending ? (
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

export default RegisterStudent
