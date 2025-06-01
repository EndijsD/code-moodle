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
import { passwordRegex } from '../../../Regex/login'

const AdministratorEditDrawer = ({
  editOpen,
  handleEditClose,
  administrator,
  updateAdminInList,
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
  })

  const isPasswordValid =
    formData.parole === '' || passwordRegex.test(formData.parole)
  const doPasswordsMatch =
    formData.parole === '' || formData.parole === formData.paroleAtk

  useEffect(() => {
    if (administrator) {
      setFormData({
        vards: administrator.vards || '',
        uzvards: administrator.uzvards || '',
        epasts: administrator.epasts || '',
        parole: '',
        paroleAtk: '',
      })
    }
  }, [administrator])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async () => {
    const newErrors = {
      vards: formData.vards.trim() === '',
      uzvards: formData.uzvards.trim() === '',
      epasts: formData.epasts.trim() === '',
    }

    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some((e) => e)

    if (hasErrors) return

    if (formData.parole && !passwordRegex.test(formData.parole)) return
    if (formData.parole !== formData.paroleAtk) return

    try {
      await axios.patch(`lietotajs/single/${administrator.lietotajs_id}`, {
        vards: formData.vards,
        uzvards: formData.uzvards,
        epasts: formData.epasts,
        ...(formData.parole ? { parole: formData.parole } : {}),
      })

      updateAdminInList(administrator.lietotajs_id, {
        vards: formData.vards,
        uzvards: formData.uzvards,
        epasts: formData.epasts,
      })

      handleEditClose()
    } catch (err) {
      console.error(err)
    }
  }

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
          <Typography variant='h6'>Rediģēt administratoru</Typography>
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
            value={formData.epasts}
            onChange={handleFormChange}
            error={errors.epasts}
            helperText={errors.epasts ? 'Šis lauks ir obligāts' : ''}
          />

          <TextField
            fullWidth
            margin='normal'
            label='Parole'
            name='parole'
            type='password'
            value={formData.parole}
            onChange={handleFormChange}
            error={formData.parole !== '' && !isPasswordValid}
            helperText={
              formData.parole !== '' && !isPasswordValid
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
            value={formData.paroleAtk}
            onChange={handleFormChange}
            error={formData.paroleAtk !== '' && !doPasswordsMatch}
            helperText={
              formData.paroleAtk !== '' && !doPasswordsMatch
                ? 'Paroles nesakrīt'
                : ''
            }
          />
        </Box>
        <Box mt={2} display='flex' justifyContent='flex-end' gap={1}>
          <Button onClick={handleEditClose} variant='outlined'>
            Atcelt
          </Button>
          <Button
            onClick={handleFormSubmit}
            variant='contained'
            color='primary'
          >
            Saglabāt
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default AdministratorEditDrawer
