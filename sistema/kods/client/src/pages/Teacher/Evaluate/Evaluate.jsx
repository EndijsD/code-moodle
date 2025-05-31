import axios from 'axios'
import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Title from '../../../components/General/Title'
import { columns } from '../../../data/Teacher/Evaluate/EvaluateData'
import { LocaleTextEvaluate } from '../../../data/DataGrid/DataGridLocaleText'
import { DataGridSx } from '../../../data/DataGrid/style'
import { initStatus } from '../../../data/initStatus'
import { useGlobalContext } from '../../../context/GlobalProvider'
import Spinner from '../../../components/General/Spinner/Spinner'

export const Evaluate = () => {
  const [fetchState, setFetchState] = useState(initStatus)
  const [data, setData] = useState(null)

  const { user } = useGlobalContext()

  const fetchTasks = () => {
    setFetchState({ pending: true, failed: false })

    axios
      .get(`custom/taskInfo/${user.skolotajs_id}`)
      .then((response) => {
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
      {fetchState.pending ? (
        <Spinner />
      ) : data ? (
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
        <Spinner />
      )}
    </>
  )
}

export default Evaluate
