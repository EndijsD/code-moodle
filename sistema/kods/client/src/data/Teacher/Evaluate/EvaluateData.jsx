import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import AssignmentIcon from '@mui/icons-material/Assignment'

export const columns = [
  { field: 'vards', headerName: 'Vārds', flex: 1, minWidth: 200 },
  { field: 'uzvards', headerName: 'Uzvārds', flex: 1, minWidth: 200 },
  { field: 'skola', headerName: 'Skola', flex: 1, minWidth: 200 },
  {
    field: 'klase',
    flex: 1,
    minWidth: 200,
    headerName: 'Klase/Kurss',
    valueGetter: (value, row) => {
      return `${row.klase}.${
        row.tips == 'Tehnikums' || row.tips == 'Augstskola' ? 'kurss' : 'klase'
      }`
    },
  },
  {
    field: 'nosaukums',
    flex: 1,
    minWidth: 200,
    headerName: 'Uzdevuma nosaukums',
  },
  {
    field: 'darbibas',
    flex: 1,
    minWidth: 200,
    align: 'center',
    headerName: 'Darbības',
    sortable: false,
    renderCell: (params) => {
      return (
        <Link to={params.row.iesniegumi_id.toString()}>
          <Button variant='contained'>
            <AssignmentIcon />
          </Button>
        </Link>
      )
    },
  },
]
