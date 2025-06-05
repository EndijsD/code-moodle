import { alpha, Box, Tooltip, Typography, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import {
  AttachFile,
  Clear,
  InfoOutlined,
  InsertDriveFile,
} from '@mui/icons-material'
import { getBase64 } from '../../../assets/generalFunction'
import * as S from './style'
import Spinner from '../Spinner/Spinner'

const FileDropzone = ({ value, onChange, name, isPending = false }) => {
  const [files, setFiles] = useState([])
  const [error, setError] = useState(null)
  const theme = useTheme()
  const didOnce = useRef(false)
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    if (!value || !value.length || didOnce.current) return

    const setData = async () => {
      try {
        // let finalFiles = null
        // console.log('value', value)
        // const filePromises = value.map(async (el) => ({
        //   id: el.id,
        //   name: el.file.name,
        //   type: el.file.type,
        //   base64: await getBase64(el.file, true),
        // }))

        // finalFiles = await Promise.all(filePromises)

        setFiles(value)
      } catch (error) {
        console.log(error)
      }
    }

    setData()
    didOnce.current = true
  }, [value])

  const handleFilesChange = async (incomingFiles) => {
    const arrayFiles = Array.from(incomingFiles)

    for (const file of arrayFiles) {
      if (file.size > 104857600) {
        setError({
          title: 'Fails pārsniedz maksimālo izmēru:',
          name: file.name,
        })

        setTimeout(() => {
          setError(null)
        }, 6000)
        return
      }
    }

    try {
      let finalFiles = null
      const filePromises = arrayFiles.map(async (el) => ({
        nosaukums: el.name,
        tips: el.type,
        base64: await getBase64(el, true),
      }))

      finalFiles = await Promise.all(filePromises)

      onChange({
        target: {
          name,
          files: files.concat(finalFiles),
        },
      })

      setFiles((prev) => prev.concat(finalFiles))
    } catch (error) {
      console.log(error)
    }
  }

  const removeFile = (file) => {
    const updated = files.filter((el) => el != file)

    setFiles(updated)
    onChange({ target: { name, files: updated } })
  }

  const onInputClick = (e) => {
    e.target.value = ''
  }

  return (
    <>
      <label
        htmlFor='file-upload'
        style={{
          width: '100%',
          height: 150,
          border: '1px dashed',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          cursor: 'pointer',
          borderColor: error ? theme.palette.error.main : 'rgba(0, 0, 0, 0.23)',
          backgroundColor: isDragOver
            ? alpha(theme.palette.primary.main, 0.1)
            : theme.palette.common.white,
        }}
        onDragOver={(e) => {
          if (!isPending) {
            e.preventDefault()
            setIsDragOver(true)
          }
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragOver(false)
          handleFilesChange(e.dataTransfer.files)
        }}
      >
        {isPending ? (
          <Spinner />
        ) : error ? (
          <>
            <Typography sx={{ fontSize: 20, pointerEvents: 'none' }}>
              {error.title}
            </Typography>
            <Typography sx={{ fontSize: 14, pointerEvents: 'none' }}>
              {error.name}
            </Typography>
          </>
        ) : (
          <>
            <Typography sx={{ fontSize: 24, pointerEvents: 'none' }}>
              Nomet vai uzspied{' '}
              <Tooltip
                sx={{ width: 14, pointerEvents: 'all' }}
                title='100MB max'
              >
                <InfoOutlined />
              </Tooltip>
            </Typography>
            <AttachFile sx={{ width: 60, pointerEvents: 'none' }} />
          </>
        )}
      </label>

      <input
        disabled={isPending}
        onClick={onInputClick}
        onChange={(e) => handleFilesChange(e.target.files)}
        id='file-upload'
        type='file'
        style={{ display: 'none' }}
        multiple
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {files.map((file, i) => (
          <S.Attachment
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: 200,
              cursor: 'pointer',
            }}
            key={i}
            title={file.nosaukums}
            onClick={() => removeFile(file)}
          >
            <Box sx={{ position: 'relative' }}>
              {file.tips.includes('image') ? (
                <img
                  style={{
                    width: 200,
                    maxHeight: 150,
                    minHeight: 100,
                    objectFit: 'contain',
                    borderRadius: '4px',
                    backgroundColor: theme.palette.common.black,
                  }}
                  src={file.base64}
                />
              ) : (
                <Box
                  sx={{
                    width: 200,
                    maxHeight: 150,
                    minHeight: 100,
                    backgroundColor: theme.palette.grey[200],
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '4px',
                  }}
                >
                  <InsertDriveFile
                    sx={{
                      width: 50,
                      height: 50,
                      color: theme.palette.grey[600],
                    }}
                  />
                </Box>
              )}

              <Box
                className='removeFile'
                sx={{
                  display: 'none',
                  position: 'absolute',
                  top: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: alpha(theme.palette.common.white, 0.5),
                  borderRadius: '4px',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Clear
                  sx={{
                    width: 50,
                    height: 50,
                    color: theme.palette.primary.main,
                    background: alpha(theme.palette.primary.main, 0.3),
                    borderRadius: '50%',
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                backgroundColor: theme.palette.grey[100],
                borderRadius: '0 0 4px 4px',
                display: 'flex',
                justifyContent: 'center',
                p: 1,
              }}
            >
              <Typography sx={{ fontSize: 12 }}>{file.nosaukums}</Typography>
            </Box>
          </S.Attachment>
        ))}
      </Box>
    </>
  )
}

export default FileDropzone
