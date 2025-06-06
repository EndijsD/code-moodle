import { DataGrid } from '@mui/x-data-grid'
import Title from '../../../components/General/Title'
import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import axios from 'axios'
import { LocaleTextStudent } from '../../../data/DataGrid/DataGridLocaleText'
import { studentColumns } from '../../../data/Teacher/StudentProfiles/StudentProfiles'
import { MessageContainer } from './style'
import { DataGridSx } from '../../../data/DataGrid/style'
import { initStatus } from '../../../data/initStatus'
import { useGlobalContext } from '../../../context/GlobalProvider'
import Spinner from '../../../components/General/Spinner/Spinner'

const StudentProfiles = () => {
  const [localeText, _] = useState(LocaleTextStudent)
  const [students, setStudents] = useState(null)
  const [status, setStatus] = useState(initStatus)
  const { user } = useGlobalContext()

  const fetchData = () => {
    axios
      .get(`custom/generalStudentInfo/${user.skolotajs_id}`)
      .then(function (res) {
        setStudents(res.data)
        setStatus({ pending: false, error: false, success: false })
      })
      .catch(function (err) {
        setStatus({ pending: false, error: true, success: false })
      })
  }

  const getStudentRowId = (row) => {
    return row.studenti_id
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      {status.pending ? (
        <Spinner />
      ) : status.error ? (
        <Box sx={MessageContainer}>
          <Typography>Servera kļūda!</Typography>
        </Box>
      ) : students != null ? (
        <>
          <Title text='Studenti' />
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'table',
              tableLayout: 'fixed',
            }}
          >
            <DataGrid
              getRowId={getStudentRowId}
              rows={students}
              columns={studentColumns}
              disableRowSelectionOnClick
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              localeText={localeText}
              sx={DataGridSx}
            />
          </Box>
        </>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default StudentProfiles
