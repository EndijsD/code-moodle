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
import { teacherColumns } from '../../../data/Admin/Admin' // You can reuse columns or define adminColumns
import { initStatusPending } from '../../../data/initStatus'
import { useGlobalContext } from '../../../context/GlobalProvider'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Spinner from '../../../components/General/Spinner/Spinner'
import { LocaleTextEvaluate } from '../../../data/DataGrid/DataGridLocaleText'
import { DataGridSx } from '../../../data/DataGrid/style'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AdministratorEditDrawer from './AdministratorDrawer' // Your admin edit drawer component

const Administrators = () => {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState(initStatusPending)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [adminToDelete, setAdminToDelete] = useState(null)

  const handleEditOpen = (admin) => {
    setSelectedAdmin(admin)
    setEditOpen(true)
  }

  const handleEditClose = () => {
    setEditOpen(false)
    setSelectedAdmin(null)
  }

  const updateAdminInList = (id, updatedFields) => {
    setData((prev) =>
      prev.map((a) => (a.lietotajs_id === id ? { ...a, ...updatedFields } : a))
    )
  }

  const { user } = useGlobalContext()

  useEffect(() => {
    if (user) {
      fetchAdministrators()
    }
  }, [])

  const fetchAdministrators = () => {
    setStatus(initStatusPending)
    axios
      .get(`custom/admins_by_school/${user.skolas_id}`)
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

  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!adminToDelete) return
    try {
      await axios
        .delete(`administrators/single/${adminToDelete.administrators_id}`)
        .then(axios.delete(`lietotajs/single/${adminToDelete.lietotajs_id}`))
      setData((prev) =>
        prev.filter((item) => item.lietotajs_id !== adminToDelete.lietotajs_id)
      )
    } catch (error) {
      console.log(error)
    } finally {
      setDeleteDialogOpen(false)
      setAdminToDelete(null)
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setAdminToDelete(null)
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
          <Title text={'Administratoru administrēšana'} />
          <Box sx={{ width: '100%', height: '100%' }}>
            <DataGrid
              getRowId={(row) => row.lietotajs_id}
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
          <AdministratorEditDrawer
            editOpen={editOpen}
            handleEditClose={handleEditClose}
            administrator={selectedAdmin}
            updateAdminInList={updateAdminInList}
          />
          <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
            <DialogTitle id='delete-dialog-title'>
              Apstiprināt dzēšanu
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Vai tiešām vēlaties dzēst administratoru{' '}
                <strong>
                  {adminToDelete?.vards} {adminToDelete?.uzvards}
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
        <Button>Pievienot administratoru</Button>
      )}
    </>
  )
}

export default Administrators
