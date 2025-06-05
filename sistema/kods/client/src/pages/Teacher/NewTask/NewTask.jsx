import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import * as S from './style'
import { useState } from 'react'
import axios from 'axios'
import { Check, Close } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { languages } from '../../../languages'
import Title from '../../../components/General/Title'
import { initStatus } from '../../../data/initStatus'
import {
  fieldError,
  initData,
  initFieldValid,
} from '../../../data/Teacher/NewTask/NewTaskInitVals'
import { useGlobalContext } from '../../../context/GlobalProvider'
import FileDropzone from '../../../components/General/FileDropzone'

const NewTask = () => {
  const nav = useNavigate()
  const [data, setData] = useState(initData)
  const [fieldValid, setFieldValid] = useState(initFieldValid)
  const [status, setStatus] = useState(initStatus)
  const { user } = useGlobalContext()
  const [files, setFiles] = useState([])

  const handleFormInputChange = (e) => {
    const { name, value } = e.target
    setData({
      ...data,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let incompleteData = false
    let tempObj = { ...fieldValid }

    for (const [key, value] of Object.entries(fieldValid)) {
      if (String(data[key]).trim()) {
        tempObj[key] = false
      } else {
        tempObj[key] = true
        incompleteData = true
      }
    }

    if (!incompleteData) {
      const postData = {
        tema: data.topic,
        nosaukums: data.name,
        apraksts: data.description,
        valoda: data.language,
        punkti: data.points,
        piemers: data.example,
        skolotajs_id: user.skolotajs_id,
      }

      setStatus({ ...status, pending: true, error: false })

      try {
        const responseTasks = await axios.post('uzdevumi', postData)

        if (files.length) {
          const filePromises = files.map((el) => ({
            ...el,
            uzdevumi_id: responseTasks.data.id,
          }))

          await axios.post('fails/multiple', filePromises)
        }

        setStatus({
          ...status,
          pending: false,
          error: false,
          success: true,
        })

        setTimeout(() => nav('/teacher/bank'), 500)
      } catch (error) {
        console.log(error)
        setStatus({ ...status, pending: false, error: true })
      }
    }
    setFieldValid(tempObj)
  }

  return (
    <Box sx={S.mainContainer}>
      <Title text='Jauns uzdevums' />
      <S.Form onSubmit={handleSubmit}>
        <TextField
          error={fieldValid.topic}
          fullWidth
          required
          label='Tēma'
          name='topic'
          onChange={handleFormInputChange}
          value={data.topic || ''}
          helperText={fieldValid.topic && fieldError}
          autoComplete='off'
        />
        <TextField
          error={fieldValid.name}
          required
          fullWidth
          label='Uzdevuma nosaukums'
          name='name'
          onChange={handleFormInputChange}
          value={data.name || ''}
          helperText={fieldValid.name && fieldError}
          autoComplete='off'
        />
        <TextField
          error={fieldValid.description}
          required
          fullWidth
          label='Apraksts'
          name='description'
          onChange={handleFormInputChange}
          value={data.description || ''}
          helperText={fieldValid.description && fieldError}
          autoComplete='off'
          multiline
        />
        <FormControl>
          <InputLabel htmlFor='prog_lan'>Programmēšanas valoda</InputLabel>
          <Select
            inputProps={{ id: 'prog_lan' }}
            error={fieldValid.language}
            required
            fullWidth
            name='language'
            label='Programmēšanas valoda'
            onChange={handleFormInputChange}
            value={data.language || ''}
            autoComplete='off'
          >
            {languages.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>

          <FormHelperText>
            {fieldValid.language && 'Neaizpildīts obligātais lauciņš!'}
          </FormHelperText>
        </FormControl>

        <TextField
          error={fieldValid.points}
          required
          fullWidth
          label='Punkti'
          name='points'
          type='number'
          value={data.points || ''}
          onChange={handleFormInputChange}
          autoComplete='off'
        />

        <TextField
          fullWidth
          label='Piemērs'
          name='example'
          disabled={data.language == '' ? true : false}
          helperText={
            data.language == '' ? 'Izvēlaties programmēšanas valodu!' : false
          }
          value={data.example || ''}
          onChange={handleFormInputChange}
          autoComplete='off'
        />

        <FileDropzone
          value={files}
          onChange={(e) => setFiles(e.target.files)}
        />

        <Button
          color={
            status.error ? 'error' : status.success ? 'success' : 'primary'
          }
          disabled={status.pending ? true : false}
          variant='contained'
          type='submit'
        >
          {status.pending ? (
            <CircularProgress size={24.5} />
          ) : status.success ? (
            <Check />
          ) : status.error ? (
            <Close />
          ) : (
            <>Pievienot</>
          )}
        </Button>
      </S.Form>
    </Box>
  )
}

export default NewTask
