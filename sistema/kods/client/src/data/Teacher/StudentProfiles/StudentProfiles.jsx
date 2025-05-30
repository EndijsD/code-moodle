import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import AccountBoxIcon from '@mui/icons-material/AccountBox'

export const studentColumns = [
  { field: 'studenti_id', headerName: 'ID', flex: 1, minWidth: 150 },
  { field: 'vards', headerName: 'Vārds', flex: 1, minWidth: 150 },
  { field: 'uzvards', headerName: 'Uzvārds', flex: 1, minWidth: 150 },
  { field: 'skola', headerName: 'Skola', flex: 1, minWidth: 150 },
  {
    field: 'klase',
    flex: 1,
    minWidth: 150,
    headerName: 'Klase/Kurss',
    valueGetter: (value, row) => {
      return `${row.klase}.${
        row.tips == 'Tehnikums' || row.tips == 'Augstskola' ? 'kurss' : 'klase'
      }`
    },
  },
  {
    field: 'darbibas',
    flex: 1,
    minWidth: 200,
    align: 'center',
    headerName: 'Veikto darbu apskate',
    sortable: false,
    renderCell: (params) => {
      return (
        <Link to={params.row.studenti_id.toString()}>
          <Button variant='contained'>
            <AccountBoxIcon />
          </Button>
        </Link>
      )
    },
  },
]
