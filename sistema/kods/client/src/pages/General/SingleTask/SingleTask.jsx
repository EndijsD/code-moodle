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

const SingleTask = () => {
  const nav = useNavigate()
  const { user } = useGlobalContext()
  const { moduleID, taskID, subID } = useParams()

  const { data, setData, isPending } = useAxios({
    url: 'custom/singleTask',
    params: {
      moduleID: moduleID,
      taskID: taskID,
    },
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
        .patch('iesniegumi/' + subID, {
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
        <Grid item xs={1} sx={{ justifySelf: 'center' }}>
          <Typography variant='h5'>Programmas Kods</Typography>

          <Box sx={{ height: 300, overflow: 'auto', maxWidth: 700 }}>
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
        <Grid item xs={1}>
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
            gap: 3,
            alignItems: !data.piemers && 'center',
          }}
        >
          <Typography variant='h5'>Apraksts</Typography>
          <Typography sx={{ maxWidth: 700 }}>{data.apraksts}</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Box sx={{ background: '#c6c6c6', height: 100, width: 200 }}></Box>
            <Box sx={{ background: '#c6c6c6', height: 100, width: 200 }}></Box>
            <Box sx={{ background: '#c6c6c6', height: 100, width: 200 }}></Box>
          </Box>
        </Grid>

        {data.piemers && (
          <Grid
            item
            xs={1}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            <Typography variant='h5'>Piemērs</Typography>
            <Box sx={{ height: 300, overflow: 'auto', maxWidth: 700 }}>
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
    )
  )
}

export default SingleTask
