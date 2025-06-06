import {
  alpha,
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Typography,
  useTheme,
} from '@mui/material'
import { useState } from 'react'
import {
  Close,
  Delete,
  Download,
  InsertDriveFile,
  Visibility,
} from '@mui/icons-material'
import * as S from './style'

const FilePreviews = ({ files, onRemove = null }) => {
  const theme = useTheme()
  const [open, setOpen] = useState(null)

  const download = (file) => {
    const link = document.createElement('a')
    link.href = file.base64
    link.download = file.nosaukums
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {files.map((file, i) => (
        <S.Attachment
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: 200,
          }}
          key={i}
          title={file.nosaukums}
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
              className='options'
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
                gap: 2,
              }}
            >
              {file.tips.includes('image') && (
                <S.StyledIconButton onClick={() => setOpen(file)}>
                  <Visibility color='primary' />
                </S.StyledIconButton>
              )}

              <S.StyledIconButton onClick={() => download(file)}>
                <Download color='primary' />
              </S.StyledIconButton>

              {onRemove && (
                <S.StyledIconButton onClick={() => onRemove(file)}>
                  <Delete color='primary' />
                </S.StyledIconButton>
              )}
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

      <Modal
        open={Boolean(open)}
        onClose={() => setOpen(null)}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          sx={{
            p: 4,
            width: '80vw',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant='h6' component='h2'>
              {open?.nosaukums}
            </Typography>

            <IconButton onClick={() => setOpen(null)}>
              <Close />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              background: theme.palette.grey[100],
              px: 4,
              mx: -4,
            }}
          >
            <img
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
              }}
              src={open?.base64}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Button endIcon={<Download />} onClick={() => download(open)}>
              Lejupielādēt
            </Button>

            {onRemove && (
              <Button
                endIcon={<Delete />}
                onClick={() => {
                  setOpen(false)
                  onRemove(open)
                }}
              >
                Dzēst
              </Button>
            )}
          </Box>
        </Paper>
      </Modal>
    </Box>
  )
}

export default FilePreviews
