import { alpha, Tooltip, Typography, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { AttachFile, InfoOutlined } from '@mui/icons-material'
import { getBase64 } from '../../../assets/generalFunction'
import Spinner from '../Spinner/Spinner'
import FilePreviews from '../FilePreviews/FilePreviews'

const FileDropzone = ({ value, onChange, name, isPending = false }) => {
  const [files, setFiles] = useState([])
  const [error, setError] = useState(null)
  const theme = useTheme()
  const didOnce = useRef(false)
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    if (!value || !value.length || didOnce.current) return

    setFiles(value)

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

  const remove = (file) => {
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

      <FilePreviews files={files} onRemove={remove} />
    </>
  )
}

export default FileDropzone
