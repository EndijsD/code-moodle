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
import * as S from '../NewTask/style'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Check, Close } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { languages } from '../../../languages'
import Title from '../../../components/General/Title'
import { MainContainerSx } from './EditTaskStyle'
import { initStatus } from '../../../data/initStatus'
import { initFieldValid } from '../../../data/Teacher/NewTask/NewTaskInitVals'
import Spinner from '../../../components/General/Spinner/Spinner'
import { base64ToFile, getBase64 } from '../../../assets/generalFunction'
import FileDropzone from '../../../components/General/FileDropzone'

const EditTask = () => {
  const { id } = useParams()
  const nav = useNavigate()
  const [data, setData] = useState()
  const [fieldValid, setFieldValid] = useState(initFieldValid)
  const [status, setStatus] = useState(initStatus)
  const [files, setFiles] = useState([])
  const [filesOriginal, setFilesOriginal] = useState([])
  const [isPendingFiles, setIsPendingFiles] = useState(true)

  const handleFormInputChange = (e) => {
    const { name, value } = e.target
    setData({
      ...data,
      [name]: value,
    })
  }

  const processFiles = (files, filesOriginal) => {
    // New files
    const newFiles = files.filter((file) => !file.fails_id)

    // Deleted files
    const currentIds = new Set(
      files.map((file) => file.fails_id).filter(Boolean)
    )
    console.log('currentIds', currentIds)
    const deletedFileIds = filesOriginal
      .map((file) => file.fails_id)
      .filter((id) => !currentIds.has(id))

    return { newFiles, deletedFileIds }
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
      }
      setStatus({ ...status, pending: true, error: false })

      try {
        await axios.patch(`uzdevumi/single/${id}`, postData)

        // let finalFiles = null
        console.log('files', files)
        const { deletedFileIds, newFiles } = processFiles(files, filesOriginal)

        console.log('deletedFileIds', deletedFileIds)
        console.log('newFiles', newFiles)
        if (deletedFileIds.length)
          await axios.delete('fails/multiple', { data: deletedFileIds })

        if (newFiles.length) {
          const filePromises = newFiles.map((el) => ({
            // nosaukums: el.name,
            // tips: el.type,
            // base64: await getBase64(el, true),
            ...el,
            uzdevumi_id: id,
          }))

          // finalFiles = await Promise.all(filePromises)

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

  useEffect(() => {
    const getData = async () => {
      try {
        const responseTasks = await axios.get(`uzdevumi/${id}`)

        let d = responseTasks.data[0]
        setData({
          topic: d.tema,
          name: d.nosaukums,
          description: d.apraksts,
          language: d.valoda,
          points: d.punkti,
          example: d.piemers,
        })

        const responseFiles = await axios.get(`custom/files/${id}`)
        const fileData = responseFiles.data

        if (fileData.length > 0)
          setFiles(
            fileData
            // fileData.map((el) => ({
            //   ...el,
            //   file: base64ToFile(el.base64, el.nosaukums, el.tips),
            // }))
          )
        setFilesOriginal(fileData)
        setIsPendingFiles(false)
      } catch (error) {
        console.log(error)
        setData('error')
      }
    }

    getData()
  }, [])

  return (
    <Box sx={MainContainerSx}>
      <Title text='Uzdevuma rediģēšana' />
      {data != undefined ? (
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
            isPending={isPendingFiles}
          />

          <Button
            color={
              status.error ? 'error' : status.success ? 'success' : 'primary'
            }
            disabled={status.pending}
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
              'Mainīt'
            )}
          </Button>
        </S.Form>
      ) : data == 'error' ? (
        <Spinner />
      ) : (
        <Spinner />
      )}
    </Box>
  )
}

export default EditTask
