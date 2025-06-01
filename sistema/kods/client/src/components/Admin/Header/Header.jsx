import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Link, useNavigate } from 'react-router-dom'
import { Logout, Person } from '@mui/icons-material'
import { links } from './links'
import * as S from './style'
import { useTheme } from '@emotion/react'
import axios from 'axios'
import { useGlobalContext } from '../../../context/GlobalProvider'
import { IconButton } from '@mui/material'

const AdminHeader = () => {
  const theme = useTheme()
  const nav = useNavigate()
  const { setUser } = useGlobalContext()

  const logout = () => {
    axios.post(`auth/logout`)
    setUser(null)
    nav('/login')
  }

  return (
    <AppBar sx={S.AppBar}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Typography variant='h6'>
            <Link to={'modules'} style={S.LogoLink}>
              Code Moodle
            </Link>
          </Typography>
          <Button
            style={{ color: theme.palette.common.white, gap: 8 }}
            onClick={() => nav('/admin/Admins')}
          >
            <Person />
            Administrātori
          </Button>
          <Button
            style={{ color: theme.palette.common.white, gap: 8 }}
            onClick={() => nav('/admin/teachers')}
          >
            <Person />
            Skolotāji
          </Button>
        </Box>
        <IconButton
          style={{ color: theme.palette.common.white }}
          onClick={logout}
        >
          <Logout />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default AdminHeader
