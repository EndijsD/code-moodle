import { useEffect, useState } from 'react'
import {
  Drawer,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import { emailRegex, passwordRegex } from '../../../Regex/login'

const UserEditDrawer = ({
  editOpen,
  handleEditClose,
  user,
  setData,
  mode = 'edit',
  userType = 'teacher', // 'teacher' or 'admin'
  skolas_id = null, // only needed for teacher
}) => {
  const [formData, setFormData] = useState({
    vards: '',
    uzvards: '',
    epasts: '',
    parole: '',
    paroleAtk: '',
  })

  const [errors, setErrors] = useState({
    vards: false,
    uzvards: false,
    epasts: false,
    parole: false,
    paroleAtk: false,
  })

  const isPasswordValid =
    formData.parole === '' || passwordRegex.test(formData.parole)
  const doPasswordsMatch =
    formData.parole === '' || formData.parole === formData.paroleAtk

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        vards: user.vards || '',
        uzvards: user.uzvards || '',
        epasts: user.epasts || '',
        parole: '',
        paroleAtk: '',
      })
    } else if (mode === 'add') {
      setFormData({
        vards: '',
        uzvards: '',
        epasts: '',
        parole: '',
        paroleAtk: '',
      })
    }
  }, [user, mode, editOpen])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async () => {
    const trimmedEpasts = formData.epasts.trim()
    const newErrors = {
      vards: formData.vards.trim() === '',
      uzvards: formData.uzvards.trim() === '',
      epasts: trimmedEpasts === '' || !emailRegex.test(trimmedEpasts),
      parole: mode === 'add' && !passwordRegex.test(formData.parole.trim()),
      paroleAtk:
        mode === 'add' && formData.parole.trim() !== formData.paroleAtk.trim(),
    }

    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some(Boolean)
    if (hasErrors || !isPasswordValid || !doPasswordsMatch) return

    try {
      if (mode === 'edit') {
        await axios.patch(`lietotajs/single/${user.lietotajs_id}`, {
          vards: formData.vards,
          uzvards: formData.uzvards,
          epasts: trimmedEpasts,
          ...(formData.parole ? { parole: formData.parole } : {}),
        })

        setData((prev) =>
          prev.map((item) =>
            item.lietotajs_id === user.lietotajs_id
              ? {
                  ...item,
                  vards: formData.vards,
                  uzvards: formData.uzvards,
                  epasts: trimmedEpasts,
                }
              : item
          )
        )
      } else if (mode === 'add') {
        const response = await axios.post(`lietotajs`, {
          vards: formData.vards,
          uzvards: formData.uzvards,
          epasts: trimmedEpasts,
          parole: formData.parole,
          loma: userType === 'teacher' ? 'skolotajs' : 'administrators',
        })

        const lietotajs_id = response.data.id

        if (userType === 'teacher') {
          const response2 = await axios.post(`skolotajs`, {
            lietotajs_id,
            skolas_id,
          })

          setData((prev) => [
            ...prev,
            {
              vards: formData.vards,
              uzvards: formData.uzvards,
              epasts: trimmedEpasts,
              lietotajs_id,
              skolotajs_id: response2.data.id,
            },
          ])
        } else if (userType === 'admin') {
          const response2 = await axios.post(`administrators`, {
            lietotajs_id,
            skolas_id,
          })

          setData((prev) => [
            ...prev,
            {
              vards: formData.vards,
              uzvards: formData.uzvards,
              epasts: trimmedEpasts,
              lietotajs_id,
              administrators_id: response2.data.id,
            },
          ])
        }
      }

      handleEditClose()
    } catch (err) {
      console.error(err)
    }
  }

  const title =
    mode === 'edit'
      ? `Rediģēt ${userType === 'teacher' ? 'skolotāju' : 'administratoru'}`
      : `Pievienot jaunu ${
          userType === 'teacher' ? 'skolotāju' : 'administratoru'
        }`

  return (
    <Drawer
      anchor='right'
      open={editOpen}
      onClose={handleEditClose}
      PaperProps={{ sx: { width: 500 } }}
    >
      <Box
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}
      >
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={2}
        >
          <Typography variant='h6'>{title}</Typography>
          <IconButton onClick={handleEditClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            fullWidth
            margin='normal'
            label='Vārds'
            name='vards'
            required
            value={formData.vards}
            onChange={handleFormChange}
            error={errors.vards}
            helperText={errors.vards ? 'Šis lauks ir obligāts' : ''}
          />
          <TextField
            fullWidth
            required
            margin='normal'
            label='Uzvārds'
            name='uzvards'
            value={formData.uzvards}
            onChange={handleFormChange}
            error={errors.uzvards}
            helperText={errors.uzvards ? 'Šis lauks ir obligāts' : ''}
          />
          <TextField
            fullWidth
            required
            margin='normal'
            label='Epasts'
            name='epasts'
            type='email'
            value={formData.epasts}
            onChange={handleFormChange}
            error={errors.epasts}
            helperText={errors.epasts ? 'Nederīgs formāts' : ''}
          />
          <TextField
            fullWidth
            margin='normal'
            label='Parole'
            name='parole'
            type='password'
            required={mode === 'add'}
            value={formData.parole}
            onChange={handleFormChange}
            error={errors.parole}
            helperText={
              errors.parole
                ? 'Parolei jābūt vismaz 8 rakstzīmēm, jāiekļauj lielie un mazie burti un cipars.'
                : ''
            }
          />
          <TextField
            fullWidth
            margin='normal'
            label='Parole atkārtoti'
            name='paroleAtk'
            type='password'
            required={mode === 'add'}
            value={formData.paroleAtk}
            onChange={handleFormChange}
            error={errors.paroleAtk}
            helperText={errors.paroleAtk ? 'Paroles nesakrīt' : ''}
          />
        </Box>
        <Box mt={2} display='flex' justifyContent='flex-start' gap={1}>
          <Button
            onClick={handleFormSubmit}
            variant='contained'
            color='primary'
          >
            Saglabāt
          </Button>
          <Button onClick={handleEditClose} variant='outlined'>
            Atcelt
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default UserEditDrawer
