import { Box, Button, ButtonGroup, CircularProgress } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Title from '../../../components/General/Title'
import { MessageContainerSx } from './BankStyle'
import { initStatusPending } from '../../../data/initStatus'
import { useGlobalContext } from '../../../context/GlobalProvider'
import NoItems from '../../../components/General/NoItems/NoItems'
import { DataGrid } from '@mui/x-data-grid'
import { bankColumns } from '../../../data/Teacher/Bank/BankColumns'
import { LocaleText } from '../../../data/DataGrid/DataGridLocaleText'
import { DataGridSx } from '../../../data/DataGrid/style'

const Bank = () => {
  const [fetchState, setFetchState] = useState(initStatusPending)
  const [data, setData] = useState(null)
  const { user } = useGlobalContext()
  const nav = useNavigate()
  const fetchBankItems = () => {
    setFetchState({ pending: true, failed: false })
    if (user.skolotajs_id) {
      axios
        .get(`custom/tasks/${user.skolotajs_id}`)
        .then((response) => {
          setData(response.data)
          setFetchState({
            ...fetchState,
            pending: false,
          })
        })
        .catch((error) => {
          console.log(error)
          setFetchState({
            failed: true,
            pending: false,
          })
        })
    }
  }

  const deleteTask = (id) => {
    axios.delete(`uzdevumi/single/${id}`).then((res) => {
      if (res.status === 200) {
        setData((prevData) =>
          prevData.filter((item) => item.uzdevumi_id !== id)
        )
      }
    })
  }

  useEffect(() => {
    fetchBankItems()
  }, [])

  const getTaskID = (row) => {
    return row.uzdevumi_id
  }

  const fullBankColumns = [
    ...bankColumns,
    {
      field: 'darbibas',
      flex: 1,
      minWidth: 200,
      align: 'center',
      headerName: 'Darbības',
      sortable: false,
      height: '100%',
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <ButtonGroup variant='contained'>
              <Button
                onClick={() =>
                  nav(`/teacher/bank/editTask/${params.row.uzdevumi_id}`)
                }
              >
                <EditIcon />
              </Button>
              <Button onClick={() => deleteTask(params.row.uzdevumi_id)}>
                <DeleteIcon />
              </Button>
            </ButtonGroup>
          </Box>
        )
      },
    },
  ]

  return (
    <>
      {fetchState.pending ? (
        <Box sx={MessageContainerSx}>
          <CircularProgress />
        </Box>
      ) : fetchState.failed ? (
        <Box sx={MessageContainerSx}>Servera kļūda!</Box>
      ) : (
        <>
          <Title text='Uzdevumu Banka' />
          <Link to='newTask' style={{ marginBottom: 16 }}>
            <Button variant='contained'>Jauns uzdevums</Button>
          </Link>
        </>
      )}
      {!fetchState.failed && !fetchState.pending && data.length ? (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'table',
            tableLayout: 'fixed',
          }}
        >
          <DataGrid
            getRowId={getTaskID}
            deleteTask={deleteTask}
            rows={data}
            columns={fullBankColumns}
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            localeText={LocaleText}
            sx={DataGridSx}
          />
        </Box>
      ) : (
        !fetchState.pending && (
          <NoItems description={'Nav izveidoti uzdevumi'} />
        )
      )}
    </>
  )
}

export default Bank
