import { Box, Button, CircularProgress, Typography } from '@mui/material'
import Title from '../../../components/General/Title'
import { useEffect, useState } from 'react'
import axios from 'axios'
import url from '../../../../url'
import { DataGrid } from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'
import DoneIcon from '@mui/icons-material/Done'
import * as S from './AssignStyle'
import { LocaleText } from '../../../data/DataGrid/DataGridLocaleText'
import {
  moduleColumns,
  studentColumns,
} from '../../../data/Teacher/AssignPage/Assign'
import { initStatus } from '../../../data/initStatus'

const Assign = () => {
  const [students, setStudents] = useState(null)
  const [modules, setModules] = useState(null)
  const [selected, setSelected] = useState({ students: [], modules: [] })
  const [localeText, _] = useState(LocaleText)
  const [status, setStatus] = useState(initStatus)
  const nav = useNavigate()

  const fetchData = () => {
    axios
      .get(`custom/generalStudentInfo`)
      .then(function (res) {
        setStudents(res.data)
      })
      .catch(function (err) {
        setStatus({ pending: false, error: true, success: false })
      })
    axios
      .get(`moduli`)
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
        axios.post(`custom/studentModules`, postObj).catch(function (err) {
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
    nav('/teacher/assign')
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      {status.pending ? (
        <Box sx={S.loaderBoxSx}>
          <CircularProgress />
        </Box>
      ) : status.error ? (
        <Box sx={S.errorBoxSx}>
          <Typography>Servera kļūda!</Typography>
        </Box>
      ) : students != null && modules != null ? (
        <>
          <Title text='Moduļu uzdošana' />
          <Typography variant='h4' sx={S.sectionTitleSx}>
            Studenti
          </Typography>
          <Box sx={S.dataGridContainerSx}>
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
              sx={S.dataGridSx}
            />
          </Box>

          <Typography variant='h4' sx={S.sectionTitleSx}>
            Moduļi
          </Typography>
          <Box sx={S.dataGridContainerSx}>
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
              sx={S.dataGridSx}
            />
          </Box>
          <Button
            color={status.success ? 'success' : 'primary'}
            variant='contained'
            onClick={handleSubmit}
            fullWidth
            sx={S.submitButtonSx}
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
