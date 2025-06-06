import {
  alpha,
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
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
import { Code, PlayArrow, Terminal } from '@mui/icons-material'
import { useState } from 'react'
import { isValidNumber } from '../../../assets/generalFunction'

const SingleTask = () => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'))
  const nav = useNavigate()
  const { user } = useGlobalContext()
  const { moduleID, taskID, subID } = useParams()
  const [activeTab, setActiveTab] = useState('code')
  const [languageSearch, setLanguageSearch] = useState('')
  const [languageId, setLanguageId] = useState()
  const [inputArr, setInputArr] = useState([])
  const [inputCount, setInputCount] = useState('')

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

  const { data: languages, isPending: isPendingLanguages } = useAxios({
    url: `https://judge0-ce.p.rapidapi.com/languages`,
    headers: {
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      'x-rapidapi-key': '7c7a84795fmsh6c1a5cd0610eb43p1e8971jsn023e9db9c509',
    },
  })

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

  const {
    data: executedCodeResult,
    setData: setExecutedCodeResult,
    isPending: isPendingExecutedCodeResult,
    request: executeCode,
  } = useAxios({
    method: 'post',
    url: `https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true&fields=*`,
    headers: {
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      'x-rapidapi-key': '7c7a84795fmsh6c1a5cd0610eb43p1e8971jsn023e9db9c509',
    },
    doNotUseEffect: true,
  })

  const runCode = () => {
    setActiveTab('terminal')

    executeCode({
      body: {
        language_id: languageId,
        source_code: data.atbilde,
        stdin: inputArr.join('\n'),
      },
    })
  }

  return (
    !isPending &&
    data && (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid
          container
          rowSpacing={isSmallScreen ? 3 : 10}
          columnSpacing={isSmallScreen ? 3 : 15}
          columns={2}
        >
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
              justifyItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h5' sx={{ mb: 1 }}>
                {activeTab == 'language'
                  ? 'Izvēlies valodu'
                  : activeTab == 'input'
                  ? 'Ievade'
                  : activeTab == 'terminal'
                  ? 'Izvade'
                  : 'Programmas kods'}
              </Typography>

              <Box sx={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
                <Box sx={{ display: 'flex', gap: '5px' }}>
                  <S.Tab
                    variant='outlined'
                    active={activeTab == 'code'}
                    onClick={() => setActiveTab('code')}
                  >
                    <Code />
                  </S.Tab>

                  <S.Tab
                    variant='outlined'
                    active={activeTab == 'terminal'}
                    onClick={() => setActiveTab('terminal')}
                  >
                    <Terminal />
                  </S.Tab>
                </Box>

                <Button
                  variant='contained'
                  sx={{ height: 25, alignSelf: 'center' }}
                  onClick={() => {
                    if (activeTab == 'language') {
                      if (languageId) setActiveTab('input')
                    } else if (activeTab == 'input') runCode()
                    else {
                      setExecutedCodeResult(null)
                      setInputArr([])
                      setActiveTab('language')
                    }
                  }}
                >
                  {['language', 'input'].includes(activeTab) ? (
                    'Nākamais'
                  ) : (
                    <PlayArrow />
                  )}
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                height: 300,
                overflow: 'auto',
                width: '100%',
                maxWidth: 1000,
                background: '#161b22',
                borderRadius: '10px',
              }}
            >
              {activeTab == 'language' ? (
                <Box sx={{ p: 2, gap: 4, display: 'flex', flexWrap: 'wrap' }}>
                  <S.Search
                    label='Search field'
                    type='search'
                    variant='filled'
                    value={languageSearch}
                    onChange={(e) => setLanguageSearch(e.target.value)}
                  />

                  <Box sx={{ gap: 2, display: 'flex', flexWrap: 'wrap' }}>
                    {languages &&
                      languages
                        .filter((el) =>
                          el.name
                            .toLowerCase()
                            .includes(languageSearch.trim().toLowerCase())
                        )
                        .map((el, i) => (
                          <S.LanguageBtn
                            key={i}
                            variant={
                              languageId == el.id ? 'contained' : 'outlined'
                            }
                            onClick={() => {
                              setLanguageId(el.id)
                            }}
                          >
                            {el.name}
                          </S.LanguageBtn>
                        ))}
                  </Box>
                </Box>
              ) : activeTab == 'input' ? (
                <Box sx={{ p: 2, gap: 4, display: 'flex', flexWrap: 'wrap' }}>
                  <S.Search
                    label='Cik daudz ievades laukus vajag?'
                    variant='filled'
                    value={inputCount}
                    onChange={(e) =>
                      isValidNumber({ value: e.target.value }) &&
                      setInputCount(e.target.value)
                    }
                  />

                  <Box
                    sx={{
                      gap: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                    }}
                  >
                    {[...Array(Number(inputCount))].map((_, i) => (
                      <S.StyledTextField
                        key={i}
                        fullWidth
                        label={'Input ' + (i + 1)}
                        value={inputArr[i] || ''}
                        onChange={(e) => {
                          const newInputArr = [...inputArr]
                          newInputArr[i] = e.target.value
                          setInputArr(newInputArr)
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              ) : activeTab == 'terminal' ? (
                isPendingExecutedCodeResult ? (
                  <Spinner />
                ) : (
                  <Box sx={{ p: 2, color: 'white' }}>
                    <Typography component='pre' sx={{ whiteSpace: 'pre-wrap' }}>
                      {executedCodeResult?.stdout ??
                        executedCodeResult?.message}
                    </Typography>
                  </Box>
                )
              ) : (
                <CodeEditor
                  value={data.atbilde}
                  language={data.valoda}
                  style={S.CodeEditor}
                  onChange={(val) =>
                    setData({ ...data, atbilde: val.target.value })
                  }
                  padding={16}
                  disabled={user.loma == 'skolotajs'}
                />
              )}
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
