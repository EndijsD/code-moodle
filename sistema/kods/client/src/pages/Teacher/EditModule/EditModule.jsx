import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import Title from '../../../components/General/Title'
import * as S from './EditModuleStyle'
import { initStatus } from '../../../data/initStatus'
import { initSearch } from '../../../data/Teacher/EditModule/data'
import { useGlobalContext } from '../../../context/GlobalProvider'
import Spinner from '../../../components/General/Spinner/Spinner'
import NoItems from '../../../components/General/NoItems/NoItems'

const EditModule = () => {
  const nav = useNavigate()
  const { id } = useParams()
  const [search, setSearch] = useState(initSearch)
  const [changed, setChanged] = useState(null)
  const [input, setInput] = useState('')
  const [tasks, setTasks] = useState(null)
  const [allTasks, setAllTasks] = useState(null)
  const [checkbox, setCheckbox] = useState(null)
  const [status, setStatus] = useState(initStatus)
  const [startData, setStartData] = useState()
  let tempArr = []
  let tempArr2 = []

  const { user } = useGlobalContext()

  const fetchData = () => {
    axios.get(`moduli/${id}`).then((res) => {
      setInput(res.data[0].nosaukums)

      axios
        .get(`custom/tasks/${user.skolotajs_id}`)
        .then((res) => {
          setAllTasks(res.data)
          for (let i = 0; i < res.data.length; i++) {
            tempArr[i] = [res.data[i].uzdevumi_id, 'off']
            tempArr2[i] = false
          }
          axios
            .get(`custom/tasks_of_module/${id}`)
            .then((res) => {
              setTasks(res)
              setStartData(res.data)
              setStatus({ pending: false, error: false })
              for (let k = 0; k < tempArr.length; k++) {
                for (let i = 0; i < res.data.length; i++) {
                  if (tempArr[k][0] == res.data[i].uzdevumi_id) {
                    tempArr[k][1] = 'on'
                  }
                }
              }
              setChanged(tempArr2)
              setCheckbox(tempArr)
            })
            .catch((error) => {
              console.log(error)
              setStatus({ pending: false, error: true })
            })
        })
        .catch((error) => {
          console.log(error)
          setStatus({ pending: false, error: true })
        })
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (e) => {
    setInput(e.target.value)
  }

  const handleSearchChange = (e) => {
    const { name, value } = e.target
    setSearch({
      ...search,
      [name]: value,
    })
  }

  const handleCheckbox = (e) => {
    let { value, name } = e.target
    let temp = [...checkbox]
    let temp2 = [...changed]
    temp[Number(name)][1] = value == 'on' ? 'off' : 'on'
    setCheckbox(temp)
    temp2[Number(name)] = !changed[Number(name)]
    setChanged(temp2)
  }

  const PostData = async () => {
    let postArr = checkbox
      .filter((el) => el[1] === 'on')
      .map((el, i) => ({
        uzdevumi_id: el[0],
        moduli_id: id,
      }))
    if (postArr.length != 0) {
      axios.post('moduli_uzdevumi/multiple', postArr).catch((error) => {
        console.log(error)
        setStatus({ ...status, error: true })
      })
    }
  }

  const handleSubmit = () => {
    axios
      .patch(`moduli/single/${id}`, { nosaukums: input })
      .then(() => {
        if (startData.length != 0) {
          axios
            .delete(`custom/removeTask/${id}`)
            .then(() => {
              PostData()
            })
            .catch((error) => {
              console.log(error)
              setStatus({ ...status, error: true })
            })
        } else {
          PostData()
        }
      })
      .finally(() => {
        setStatus({ ...status, success: true })
        setTimeout(() => {
          nav('/teacher/modules')
        }, 1000)
      })
  }

  return (
    <>
      <Title text='Moduļa rediģēšana' />
      {status.pending ? (
        <Spinner />
      ) : status.error ? (
        <Typography>Servera kļūda!</Typography>
      ) : input != '' && tasks != null ? (
        <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            value={input}
            placeholder='Moduļa nosaukums'
            onChange={handleChange}
          />
          <Typography variant='h4' sx={S.TasksHeading}>
            Uzdevumi
          </Typography>
          <Box sx={S.FilterContainer}>
            <Typography variant='h4' sx={S.FilterHeading}>
              Filtrēšana
            </Typography>
            <TextField
              onChange={handleSearchChange}
              value={search.tema}
              name='tema'
              variant='standard'
              placeholder='Tēma'
            />
            <TextField
              onChange={handleSearchChange}
              value={search.nos}
              name='nos'
              variant='standard'
              placeholder='Uzdevums'
            />
            <TextField
              onChange={handleSearchChange}
              value={search.valoda}
              name='valoda'
              variant='standard'
              placeholder='Programmēšanas valoda'
            />
            <TextField
              onChange={handleSearchChange}
              value={search.punkti}
              name='punkti'
              variant='standard'
              placeholder='Punkti'
            />
          </Box>
          <Grid container spacing={2}>
            {allTasks != null &&
              checkbox != null &&
              allTasks.map((item, i) => {
                return (
                  <Grid
                    item
                    xs={4}
                    key={item.uzdevumi_id}
                    sx={{
                      display:
                        search.tema != '' &&
                        !item.tema
                          .toLowerCase()
                          .includes(search.tema.toLowerCase())
                          ? 'none'
                          : search.tema == '' &&
                            'block' &&
                            search.nos != '' &&
                            !item.nosaukums
                              .toLowerCase()
                              .includes(search.nos.toLowerCase())
                          ? 'none'
                          : search.nos == '' &&
                            'block' &&
                            search.valoda != '' &&
                            !item.valoda
                              .toLowerCase()
                              .includes(search.valoda.toLowerCase())
                          ? 'none'
                          : search.valoda == '' &&
                            'block' &&
                            search.punkti != '' &&
                            !item.punkti
                              .toString()
                              .includes(search.punkti.toLowerCase())
                          ? 'none'
                          : search.punkti == '' && 'block',
                    }}
                  >
                    <Card sx={S.CardSx} variant='outlined'>
                      <Checkbox
                        name={`${i}`}
                        value={checkbox[i][1]}
                        onClick={handleCheckbox}
                        checked={checkbox[i][1] == 'on' ? true : false}
                      />
                      <Box sx={S.CardContent}>
                        <Typography>Tēma: {item.tema}</Typography>
                        <Typography>Uzdevums: {item.nosaukums}</Typography>
                        <Typography>
                          Programmēšanas valoda: {item.valoda}
                        </Typography>
                        <Typography>Punkti: {item.punkti}</Typography>
                      </Box>
                    </Card>
                  </Grid>
                )
              })}
          </Grid>
          <Button
            variant='contained'
            onClick={handleSubmit}
            fullWidth
            sx={{ mt: 4 }}
          >
            Iesniegt
          </Button>
        </Box>
      ) : (
        <NoItems description={'Nav uzdevumu!'} />
      )}
    </>
  )
}

export default EditModule
