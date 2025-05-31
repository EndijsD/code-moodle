import axios from 'axios'
import { useEffect, useState } from 'react'
import url from '../../../../url'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import { Add, Delete, Edit } from '@mui/icons-material'
import Title from '../../../components/General/Title'
import { Link } from 'react-router-dom'
import * as S from './ModulesStyle'

const Modules = () => {
  const [data, setData] = useState(undefined)
  const [display, setDisplay] = useState(undefined)
  const [search, setSearch] = useState('')

  const fetchData = () => {
    axios.get(`moduli`).then(function (response) {
      setData(response.data)
      setDisplay(response.data)
    })
  }

  const filterData = (obj) => {
    if (obj.nosaukums.toLowerCase().includes(search.toLowerCase())) {
      return obj
    }
  }

  useEffect(() => {
    if (search != '') {
      setDisplay(data.filter(filterData))
    } else {
      setDisplay(data)
    }
  }, [search])

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (e) => {
    setSearch(e.target.value)
  }

  const handleDelete = (moduleID, arrEl) => {
    axios.delete('moduli/single/' + moduleID).then((res) => {
      if (res.statusText == 'OK') {
        const temp = [...data]
        temp.splice(arrEl, 1)
        setData(temp)
        setDisplay(temp)
      }
    })
  }

  return (
    <>
      <Title text='Moduļi' />
      <TextField
        value={search}
        onChange={handleChange}
        placeholder='Meklēt pēc nosaukuma'
        sx={S.Input}
        variant='outlined'
      />

      {data != undefined ? (
        <Grid container spacing={2}>
          {search === '' && (
            <Grid item xs={4}>
              <Link to={`create`} style={{ textDecoration: 'none' }}>
                <Card sx={S.AddCardSx}>
                  <Add /> Pievienot
                </Card>
              </Link>
            </Grid>
          )}

          {display.map((item, i) => {
            return (
              <Grid item xs={4} key={item.moduli_id}>
                <Card variant='outlined' sx={S.CardSx}>
                  <Box sx={S.CardContent}>
                    <Typography
                      sx={{
                        textAlign: 'center',
                      }}
                    >
                      {item.nosaukums}
                    </Typography>
                  </Box>
                  <ButtonGroup sx={{ width: '100%' }}>
                    <Button
                      variant='outlined'
                      sx={{ width: '50%' }}
                      onClick={() => handleDelete(item.moduli_id, i)}
                    >
                      Dzēst <Delete />
                    </Button>
                    <Link
                      to={`edit/${item.moduli_id}`}
                      style={{ width: '50%' }}
                    >
                      <Button variant='outlined' sx={{ width: '100%' }}>
                        Rediģēt <Edit />
                      </Button>
                    </Link>
                  </ButtonGroup>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      ) : (
        <CircularProgress />
      )}
    </>
  )
}

export default Modules
