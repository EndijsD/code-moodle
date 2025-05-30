import axios from 'axios'
import { useEffect, useState } from 'react'
import url from '../../../../url'
import { Box, CircularProgress, Paper } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Title from '../../../components/General/Title'
import { columns } from '../../../data/Teacher/Evaluate/EvaluateData'
import { LocaleTextEvaluate } from '../../../data/DataGrid/DataGridLocaleText'
import { DataGridSx } from '../../../data/DataGrid/style'
import { initStatus } from '../../../data/initStatus'

export const Evaluate = () => {
  const [fetchState, setFetchState] = useState(initStatus)
  const [data, setData] = useState(null)

  const fetchTasks = () => {
    setFetchState({ pending: true, failed: false })

    axios
      .get('custom/taskInfo')
      .then(function (response) {
        setData(response.data)
        setFetchState({
          ...fetchState,
          pending: false,
        })
      })
      .catch(function (error) {
        setFetchState({
          failed: true,
          pending: false,
        })
        console.log(error)
      })
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const getRowId = (row) => {
    return row.iesniegumi_id
  }

  return (
    <>
      {data ? (
        <>
          <Title text='Vērtēšana' />
          <DataGrid
            getRowId={getRowId}
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            localeText={LocaleTextEvaluate}
            disableRowSelectionOnClick
            sx={DataGridSx}
          />
        </>
      ) : (
        <Box sx={{ height: '100%', alignContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
    </>
  )
}

export default Evaluate
