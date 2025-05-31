import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import * as S from './style'
import { initStatus } from '../../../data/initStatus'
import { initSearch } from '../../../data/Teacher/EditModule/data'
import { useGlobalContext } from '../../../context/GlobalProvider'

const NewModule = () => {
  const nav = useNavigate()
  const [search, setSearch] = useState(initSearch)
  const [input, setInput] = useState('')
  const [allTasks, setAllTasks] = useState(null)
  const [checkbox, setCheckbox] = useState(null)
  const [status, setStatus] = useState(initStatus)
  let tempArr = []

  const { user } = useGlobalContext()

  const fetchData = () => {
    console.log(user.skolotajs_id)

    axios
      .get(`custom/tasks/${user.skolotajs_id}`)
      .then(function (res) {
        setAllTasks(res.data)
        for (let i = 0; i < res.data.length; i++) {
          tempArr[i] = [res.data[i].uzdevumi_id, 'off']
        }
        setStatus({ pending: false, error: false })
        setCheckbox(tempArr)
      })
      .catch(function (error) {
        console.log(error)
        setStatus({ pending: false, error: true })
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
    temp[Number(name)][1] = value == 'on' ? 'off' : 'on'
    setCheckbox(temp)
  }

  const handleSubmit = () => {
    let newId
    axios
      .post(`moduli`, { nosaukums: input, skolotajs_id: user.skolotajs_id })
      .then(function (res) {
        newId = res.data.id
        for (let i = 0; i < allTasks.length; i++) {
          if (checkbox[i][1] == 'on') {
            let temp = { uzdevumi_id: checkbox[i][0], moduli_id: newId }
            axios.post(`moduli_uzdevumi`, temp)
          }
        }
        nav('/teacher/modules')
      })
  }

  return (
    <>
      <Title text='Jauns modulis' />
      {status.pending ? (
        <CircularProgress />
      ) : status.error ? (
        <Typography>Servera kļūda!</Typography>
      ) : allTasks != null && allTasks.length != 0 ? (
        <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            value={input}
            placeholder='Moduļa nosaukums'
            onChange={handleChange}
          />
          <Typography variant='h4' sx={S.TitleSx}>
            Uzdevumi
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant='h4' sx={S.Title2Sx}>
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
                    <Card sx={S.ItemCard} variant='outlined'>
                      <Checkbox
                        name={`${i}`}
                        value={checkbox[i][1]}
                        onClick={handleCheckbox}
                        checked={checkbox[i][1] == 'on' ? true : false}
                      />
                      <Box sx={{ width: '100%', p: 1 }}>
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
        <Typography>Nav uzdevumu!</Typography>
      )}
    </>
  )
}

export default NewModule
