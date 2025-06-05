import {
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import useAxios from '../../../hooks/useAxios'
import * as S from './style'
import CodeEditor from '@uiw/react-textarea-code-editor'
import ChatBox from '../../../components/General/ChatBox'
import axios from 'axios'
import moment from 'moment'
import { useGlobalContext } from '../../../context/GlobalProvider'
import Spinner from '../../../components/General/Spinner/Spinner'
import FilePreviews from '../../../components/General/FilePreviews/FilePreviews'

const SingleTask = () => {
  const nav = useNavigate()
  const { user } = useGlobalContext()
  const { moduleID, taskID, subID } = useParams()

  const { data, setData, isPending } = useAxios(
    user && user.loma === 'students'
      ? {
          url: 'custom/singleTask',
          params: {
            moduleID: moduleID,
            taskID: taskID,
          },
        }
      : {
          url: `custom/singleTask/${subID}`,
        }
  )

  const { data: files, isPending: isPendingFiles } = useAxios({
    url: `custom/files/${taskID}`,
  })

  const handleSubmit = () => {
    if (user.loma == 'students')
      if (data.iesniegumi_id) {
        axios
          .patch('iesniegumi/single/' + data.iesniegumi_id, {
            atbilde: data.atbilde,
            punkti: null,
          })
          .then((res) => {
            if (String(res.status).charAt(0) == '2') {
              nav('/student/modules')
            }
          })
      } else {
        axios
          .post('iesniegumi', {
            datums: moment().format('YYYY-MM-DD HH:mm:ss'),
            atbilde: data.atbilde,
            uzdevumi_id: taskID,
            studenti_id: user.studenti_id,
            moduli_id: moduleID,
          })
          .then((res) => {
            if (String(res.status).charAt(0) == '2') {
              nav('/student/modules')
            }
          })
      }
    else {
      axios
        .patch('iesniegumi/single/' + subID, {
          punkti: data.i_punkti,
        })
        .then((res) => {
          if (String(res.status).charAt(0) == '2') {
            nav('/teacher/evaluate')
          }
        })
    }
  }

  const isNumeric = (str) => {
    if (typeof str != 'string') return false
    return !isNaN(str) && !isNaN(parseFloat(str))
  }

  const setPoints = (val) => {
    if (isNumeric(val.target.value) || val.target.value == '')
      setData({ ...data, i_punkti: val.target.value })
  }

  return (
    !isPending &&
    data && (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid container rowSpacing={10} columnSpacing={15} columns={2}>
          <Grid item xs={2}>
            <S.Header>
              {user.loma == 'skolotajs' ? (
                <TextField
                  value={data.i_punkti || ''}
                  onChange={setPoints}
                  variant='standard'
                  sx={{ width: 60 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        / {data.u_punkti}
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                <Typography variant='h5'>
                  {(data.i_punkti || 0) + ' / ' + data.u_punkti}
                </Typography>
              )}
              <Box sx={{ alignSelf: 'center', textAlign: 'center' }}>
                <Typography variant='h6' color='text.secondary'>
                  {data.tema}
                </Typography>
                <Typography
                  variant='h4'
                  sx={{ fontWeight: '600', letterSpacing: 5 }}
                >
                  {data.nosaukums}
                </Typography>
              </Box>
              <Box>
                <Button variant='contained' onClick={handleSubmit}>
                  Iesniegt
                </Button>
              </Box>
            </S.Header>
          </Grid>

          <Grid
            item
            xs={1}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              justifyItems: 'center',
            }}
          >
            <Typography variant='h5'>Programmas Kods</Typography>

            <Box
              sx={{
                height: 300,
                overflow: 'auto',
                width: '100%',
                maxWidth: 1000,
              }}
            >
              <CodeEditor
                value={data.atbilde}
                language={data.valoda}
                style={S.CodeEditor}
                onChange={(val) =>
                  setData({ ...data, atbilde: val.target.value })
                }
                padding={15}
                disabled={user.loma == 'skolotajs'}
              />
            </Box>
          </Grid>

          <Grid
            item
            xs={1}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              justifyItems: 'center',
            }}
          >
            <Typography variant='h5'>Komentāri</Typography>

            <ChatBox
              subID={user.loma == 'skolotajs' ? subID : data.iesniegumi_id}
            />
          </Grid>

          <Grid
            item
            xs={data.piemers ? 1 : 2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              justifyItems: 'center',
            }}
          >
            <Typography variant='h5'>Apraksts</Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                alignItems: !data.piemers && 'center',
                width: '100%',
                maxWidth: 1000,
              }}
            >
              <Typography sx={{ maxWidth: 700 }}>{data.apraksts}</Typography>

              {isPendingFiles ? <Spinner /> : <FilePreviews files={files} />}
            </Box>
          </Grid>

          {data.piemers && (
            <Grid
              item
              xs={1}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                justifyItems: 'center',
              }}
            >
              <Typography variant='h5'>Piemērs</Typography>

              <Box
                sx={{
                  height: 300,
                  overflow: 'auto',
                  width: '100%',
                  maxWidth: 1000,
                }}
              >
                <CodeEditor
                  disabled
                  value={data.piemers}
                  language={data.valoda}
                  style={S.CodeEditor}
                  onChange={(content) =>
                    setData({ ...data, piemers: content.target.value })
                  }
                  padding={15}
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    )
  )
}

export default SingleTask
