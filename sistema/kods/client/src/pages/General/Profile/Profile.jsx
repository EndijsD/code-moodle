import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProfileDataInit } from '../../../data/General/ProfileData'
import { initStatusPending } from '../../../data/initStatus'
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import * as S from './style'
import { useGlobalContext } from '../../../context/GlobalProvider'
import Title from '../../../components/General/Title/Title'
import { passwordRegex } from '../../../Regex/login'
import axios from 'axios'

const Profile = () => {
  const nav = useNavigate()
  const [data, setData] = useState(ProfileDataInit)
  const [fieldValid, setFieldValid] = useState(ProfileDataInit)
  const [status, setStatus] = useState(initStatusPending)
  const [submit, setSubmit] = useState(false)
  const { user, setUser } = useGlobalContext()
  const [changes, setChanges] = useState(false)
  const [schools, setSchools] = useState([])
  const [classes, setClasses] = useState([[]])
  const [initialKlase, setInitialKlase] = useState('')
  const [initialKlaseApplied, setInitialKlaseApplied] = useState(false)

  useEffect(() => {
    if (user) {
      setData((prev) => ({
        ...prev,
        epasts: user.epasts || '',
        uzvards: user.uzvards || '',
        vards: user.vards || '',
      }))
      if (user && user.loma === 'students') {
        setStatus((prev) => ({ ...prev, pending: true }))
        axios
          .get(`skolas`)
          .then((res) => {
            setSchools(res.data)
            axios
              .get(`custom/Student_School_Class/${user.studenti_id}`)
              .then((res) => {
                const skolId = res.data[0].skolas_id.toString()
                const klaseVal = res.data[0].klase

                // Only set skolas_id initially
                setData((prev) => ({
                  ...prev,
                  skolas_id: skolId,
                }))

                // Save klaseVal to a separate state temporarily
                setInitialKlase(klaseVal)
              })
          })
          .catch(() => setStatus((prev) => ({ ...prev, error: true })))
        setStatus((prev) => ({ ...prev, pending: false }))
      }
      setStatus((prev) => ({ ...prev, pending: false }))
    }
  }, [])

  useEffect(() => {
    if (data.skolas_id) {
      updateClasses(data.skolas_id)
      if (initialKlase && !initialKlaseApplied) {
        setData((prev) => ({
          ...prev,
          klase: initialKlase,
        }))
        setInitialKlaseApplied(true)
      }
    }
  }, [data.skolas_id])

  useEffect(() => {
    detectChanges()
    validate()
  }, [data])

  const detectChanges = () => {
    if (user) {
      if (
        user.vards != data.vards ||
        user.uzvards != data.uzvards ||
        user.epasts != data.epasts ||
        data.parole.trim() != '' ||
        data.paroleAtk.trim() != '' ||
        data.klase != initialKlase
      ) {
        setChanges(true)
      } else {
        setChanges(false)
      }
    } else {
      //User will not be able to submit without user data being present
      setChanges(false)
    }
  }

  const handleSubmit = () => {
    setSubmit(true)
    if (validate()) {
      if (user) {
        let postData = {
          vards: data.vards,
          uzvards: data.uzvards,
          epasts: data.epasts,
        }
        if (data.parole != '') {
          postData = { ...postData, parole: data.parole }
        }
        console.log(user.loma)

        if (user.loma === 'students') {
          axios
            .patch(`lietotajs/single/${user.lietotajs_id}`, postData)
            .then((res) => {
              setUser({
                ...user,
                vards: data.vards,
                uzvards: data.uzvards,
                epasts: data.epasts,
              })
              axios
                .patch(`studenti/single/${user.studenti_id}`, {
                  klase: data.klase,
                  skolas_id: data.skolas_id,
                })
                .catch((err) => console.log(err))
            })
            .finally(nav('/student/modules'))
            .catch((err) => console.log(err))
        } else {
          axios
            .patch(`lietotajs/single/${user.lietotajs_id}`, postData)
            .then(() => {
              setUser({
                ...user,
                vards: data.vards,
                uzvards: data.uzvards,
                epasts: data.epasts,
              })
            })
            .finally(nav('/teacher/students'))
            .catch((err) => console.log(err))
        }
      }
    }
  }

  const validate = () => {
    let valid = true

    const updateError = (field, message) => {
      setFieldValid((prev) => ({ ...prev, [field]: message }))
      if (message) valid = false
    }

    const checkEmpty = (field, label) => {
      const currentValue = data[field]

      if (user && currentValue !== user[field]) {
        updateError(field, !currentValue ? `${label} ir tukšs` : '')
      } else {
        updateError(field, '')
      }
    }

    // Validate email, first name, last name
    checkEmpty('epasts', 'Epasts')
    checkEmpty('vards', 'Vārds')
    checkEmpty('uzvards', 'Uzvārds')

    // Validate passwords
    const { parole, paroleAtk } = data

    if (parole || paroleAtk) {
      if (!parole) {
        updateError('parole', 'Lauks ir tukšs')
        updateError('paroleAtk', '')
      } else if (!paroleAtk) {
        updateError('parole', '')
        updateError('paroleAtk', 'Lauks ir tukšs')
      } else if (parole !== paroleAtk) {
        updateError('parole', 'Paroles nesakrīt')
        updateError('paroleAtk', 'Paroles nesakrīt')
      } else if (!passwordRegex.test(parole)) {
        updateError('parole', 'Parole nav derīga')
        updateError('paroleAtk', 'Parole nav derīga')
      }
    } else {
      updateError('parole', '')
      updateError('paroleAtk', '')
    }

    if (data.skolas_id != '') {
      if (data.klase === '') {
        updateError('klase', 'Nav izvēlēts klase/kurss')
      } else {
        updateError('klase', '')
      }
    }

    return valid
  }

  const handleCancel = () => {
    if (user && user.loma === 'skolotajs') {
      nav('/teacher/students')
    } else {
      nav('/student/modules')
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

    let fullArr = []
    for (let i = range[0]; i <= range[1]; i++) fullArr.push(i)

    setClasses([fullArr, endText])
  }

  const handleChange = (e) => {
    const { value, name } = e.target
    if (name === 'skolas_id') {
      setData((prev) => ({
        ...prev,
        [name]: value,
        klase: '',
      }))
      updateClasses(value)
    } else {
      if (name === 'klase') {
        setData((prev) => ({
          ...prev,
          [name]: value.toString(),
        }))
      } else {
      }
      setData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  return (
    <>
      <Box
        sx={{
          ...S.MainContainer,
          justifyContent: status.pending ? 'center' : 'start',
          gap: 3,
        }}
      >
        {status.pending ? (
          <CircularProgress />
        ) : (
          <>
            <Title text='Profila iestatījumi' />
            <TextField
              sx={{ width: '100%' }}
              value={data.vards}
              name='vards'
              placeholder='Vārds'
              label='Vārds'
              required
              onChange={handleChange}
              error={submit && fieldValid.vards != ''}
              helperText={submit ? fieldValid.vards : ''}
            />
            <TextField
              sx={{ width: '100%' }}
              value={data.uzvards}
              name='uzvards'
              required
              placeholder='Uzvārds'
              label='Uzvārds'
              onChange={handleChange}
              error={submit && fieldValid.uzvards != ''}
              helperText={submit ? fieldValid.uzvards : ''}
            />
            <TextField
              sx={{ width: '100%' }}
              value={data.epasts}
              name='epasts'
              required
              placeholder='Epasts'
              label='Epasts'
              onChange={handleChange}
              error={submit && fieldValid.epasts != ''}
              helperText={submit ? fieldValid.epasts : ''}
            />
            <TextField
              sx={{ width: '100%' }}
              value={data.parole}
              type='password'
              name='parole'
              placeholder='Parole'
              label='Parole'
              onChange={handleChange}
              error={submit && fieldValid.parole != ''}
              helperText={submit ? fieldValid.parole : ''}
            />
            <TextField
              sx={{ width: '100%' }}
              value={data.paroleAtk}
              name='paroleAtk'
              placeholder='Ievadiet paroli atkārtoti'
              label='Ievadiet paroli atkārtoti'
              onChange={handleChange}
              error={submit && fieldValid.paroleAtk != ''}
              helperText={submit ? fieldValid.paroleAtk : ''}
            />
            {user && user.loma === 'students' && (
              <>
                <FormControl
                  sx={S.FormControlSx}
                  variant='standard'
                  disabled={!schools.length}
                  fullWidth
                >
                  <InputLabel htmlFor='school'>Skola</InputLabel>
                  <Select
                    name='skolas_id'
                    value={data.skolas_id || ''}
                    inputProps={{ id: 'school' }}
                    onChange={handleChange}
                  >
                    {schools.map((school, i) => (
                      <MenuItem key={i} value={school.skolas_id}>
                        {school.nosaukums}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  fullWidth
                  sx={S.FormControlSx}
                  variant='standard'
                  disabled={!classes[0].length}
                  error={submit && fieldValid.klase != ''}
                >
                  <InputLabel htmlFor='class'>Klase/Kurss</InputLabel>
                  <Select
                    name='klase'
                    inputProps={{ id: 'class' }}
                    value={data.klase}
                    onChange={handleChange}
                  >
                    {classes[0].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num + '. ' + classes[1]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
            <Box
              sx={{
                display: 'flex',
                gap: 4,
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <Button
                variant='outlined'
                disabled={!changes}
                onClick={handleSubmit}
                fullWidth
              >
                Mainīt
              </Button>
              <Button variant='outlined' onClick={handleCancel} fullWidth>
                Atcelt
              </Button>
            </Box>
          </>
        )}
      </Box>
    </>
  )
}

export default Profile
