import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import Title from '../../../components/General/Title'
import { DataGrid } from '@mui/x-data-grid'
import { teacherColumns } from '../../../data/Admin/Admin'
import { initStatusPending } from '../../../data/initStatus'
import { useGlobalContext } from '../../../context/GlobalProvider'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Spinner from '../../../components/General/Spinner/Spinner'
import { LocaleTextEvaluate } from '../../../data/DataGrid/DataGridLocaleText'
import { DataGridSx } from '../../../data/DataGrid/style'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import UserEditDrawer from '../../../components/Admin/UserDrawer'

const Teachers = () => {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState(initStatusPending)
  const [drawer, setDrawer] = useState({ open: false, mode: '' })
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [teacherToDelete, setTeacherToDelete] = useState(null)
  const { user } = useGlobalContext()

  const handleEditOpen = (teacher) => {
    setSelectedTeacher(teacher)
    setDrawer({ mode: 'edit', open: true })
  }

  const handleEditClose = () => {
    setDrawer((prev) => ({ ...prev, open: false }))
    setSelectedTeacher(null)
  }

  useEffect(() => {
    if (user) {
      fetchTeachers()
    }
  }, [])

  const fetchTeachers = () => {
    setStatus(initStatusPending)
    axios
      .get(`custom/teachers_by_school/${user.skolas_id}`)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data)
          setStatus({ pending: false, error: false })
        } else {
          setStatus({ pending: false, error: true })
        }
      })
      .catch(() => setStatus({ pending: false, error: true }))
  }

  const handleDeleteClick = (teacher) => {
    setTeacherToDelete(teacher)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!teacherToDelete) return
    try {
      axios
        .delete(`skolotajs/single/${teacherToDelete.skolotajs_id}`)
        .then(axios.delete(`lietotajs/single/${teacherToDelete.lietotajs_id}`))

      setData((prev) =>
        prev.filter(
          (item) => item.skolotajs_id !== teacherToDelete.skolotajs_id
        )
      )
    } catch (error) {
      console.log(error)
    } finally {
      setDeleteDialogOpen(false)
      setTeacherToDelete(null)
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setTeacherToDelete(null)
  }

  const columnsWithActions = teacherColumns.map((col) =>
    col.field === 'darbibas'
      ? {
          ...col,
          renderCell: (params) => (
            <ButtonGroup
              sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                onClick={() => handleDeleteClick(params.row)}
                variant='contained'
              >
                <DeleteIcon />
              </Button>
              <Button
                onClick={() => handleEditOpen(params.row)}
                variant='contained'
              >
                <EditIcon />
              </Button>
            </ButtonGroup>
          ),
        }
      : col
  )

  return (
    <>
      {status.pending ? (
        <Spinner />
      ) : status.error ? (
        <>Servera kļūda!</>
      ) : data != null ? (
        <>
          <Title text={'Skolotāju administrēšana'} />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              mb: 4,
            }}
          >
            <Button
              variant='outlined'
              onClick={() => setDrawer({ open: true, mode: 'add' })}
            >
              Pievienot skolotaju
            </Button>
          </Box>
          <Box sx={{ width: '100%', height: '100%' }}>
            <DataGrid
              getRowId={(row) => row.skolotajs_id}
              rows={data}
              columns={columnsWithActions}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10]}
              localeText={LocaleTextEvaluate}
              disableRowSelectionOnClick
              sx={DataGridSx}
            />
          </Box>
          <UserEditDrawer
            handleEditClose={handleEditClose}
            user={selectedTeacher}
            userType='teacher'
            editOpen={drawer.open}
            mode={drawer.mode}
            setData={setData}
            skolas_id={user.skolas_id}
          />

          <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
            <DialogTitle id='delete-dialog-title'>
              Apstiprināt dzēšanu
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Vai tiešām vēlaties dzēst lietotāju
                <strong>
                  {' ' /*!important*/}
                  {teacherToDelete?.vards} {teacherToDelete?.uzvards}
                </strong>
                ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelDelete} variant='outlined'>
                Atcelt
              </Button>
              <Button onClick={confirmDelete} color='error' variant='contained'>
                Dzēst
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Button>Pievienot lietotāju</Button>
      )}
    </>
  )
}

export default Teachers
