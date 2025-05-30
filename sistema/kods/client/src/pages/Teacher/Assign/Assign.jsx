import { Box, Button, CircularProgress, Typography } from '@mui/material'
import Title from '../../../components/General/Title'
import { useEffect, useState } from 'react'
import axios from 'axios'
import url from '../../../../url'
import { DataGrid } from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'
import DoneIcon from '@mui/icons-material/Done'
import {
  loaderBoxSx,
  sectionTitleSx,
  dataGridSx,
  submitButtonSx,
  dataGridContainerSx,
  errorBoxSx,
} from './AssignStyle'
import { LocaleText } from '../../../data/DataGridLocaleText'
import { moduleColumns, studentColumns } from '../../../data/Assign'

const Assign = () => {
  const nav = useNavigate()
  const [students, setStudents] = useState(null)
  const [modules, setModules] = useState(null)
  const [selected, setSelected] = useState({ students: [], modules: [] })
  const [localeText, _] = useState(LocaleText)
  const [containerWidth, setContainerWidth] = useState('100%')

  const [status, setStatus] = useState({
    pending: true,
    error: false,
    success: false,
  })

  const fetchData = () => {
    axios
      .get(`${url}custom/generalStudentInfo`)
      .then(function (res) {
        setStudents(res.data)
      })
      .catch(function (err) {
        setStatus({ pending: false, error: true, success: false })
      })
    axios
      .get(`${url}moduli`)
      .then(function (res) {
        setModules(res.data)
        setStatus({ pending: false, error: false, success: false })
      })
      .catch(function (err) {
        setStatus({ pending: false, error: true, success: false })
      })
  }

  const getStudentRowId = (row) => {
    return row.studenti_id
  }

  const getModuleRowId = (row) => {
    return row.moduli_id
  }

  const handleSubmit = () => {
    for (let i = 0; i < selected.students.length; i++) {
      for (let k = 0; k < selected.modules.length; k++) {
        let postObj = {
          studenti_id: selected.students[i],
          moduli_id: selected.modules[k],
        }
        axios
          .post(`${url}custom/studentModules`, postObj)
          .catch(function (err) {
            setStatus({ pending: false, error: true, success: false })
          })
      }
    }
    if (status.error != true) {
      setStatus({ pending: false, error: false, success: true })
      setTimeout(() => {
        location.reload()
      }, 1000)
    }
    nav('/admin/assign')
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 600) {
        setContainerWidth('100%')
      } else if (width < 960) {
        setContainerWidth('90%')
      } else {
        setContainerWidth('80%')
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {status.pending ? (
        <Box sx={loaderBoxSx}>
          <CircularProgress />
        </Box>
      ) : status.error ? (
        <Box sx={errorBoxSx}>
          <Typography>Servera kļūda!</Typography>
        </Box>
      ) : students != null && modules != null ? (
        <>
          <Title text='Moduļu uzdošana' />
          <Typography variant='h4' sx={sectionTitleSx}>
            Studenti
          </Typography>
          <Box sx={dataGridContainerSx}>
            <DataGrid
              checkboxSelection
              getRowId={getStudentRowId}
              rows={students}
              columns={studentColumns}
              onRowSelectionModelChange={(ids) => {
                setSelected({ ...selected, students: ids })
              }}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              localeText={localeText}
              sx={dataGridSx}
            />
          </Box>

          <Typography variant='h4' sx={sectionTitleSx}>
            Moduļi
          </Typography>
          <Box sx={dataGridContainerSx}>
            <DataGrid
              checkboxSelection
              getRowId={getModuleRowId}
              rows={modules}
              columns={moduleColumns}
              onRowSelectionModelChange={(ids) => {
                setSelected({ ...selected, modules: ids })
              }}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              localeText={localeText}
              sx={dataGridSx}
            />
          </Box>
          <Button
            color={status.success ? 'success' : 'primary'}
            variant='contained'
            onClick={handleSubmit}
            fullWidth
            sx={submitButtonSx}
          >
            {status.success ? <DoneIcon /> : `Iesniegt`}
          </Button>
        </>
      ) : (
        <Typography>Servera kļūda!</Typography>
      )}
    </>
  )
}

export default Assign
