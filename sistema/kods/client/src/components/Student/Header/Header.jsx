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

const Header = () => {
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
      <Toolbar>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          <Link to={'modules'} style={S.LogoLink}>
            Code Moodle
          </Link>
        </Typography>

        <Box>
          {links.map((link) => (
            <Link to={link.path} key={link.path}>
              <Button sx={S.HeaderItemButton}>
                {link.icon}
                {link.title}
              </Button>
            </Link>
          ))}
          <IconButton
            style={{ color: theme.palette.common.white }}
            onClick={() => nav('/student/profile')}
          >
            <Person />
          </IconButton>
          <IconButton
            style={{ color: theme.palette.common.white }}
            onClick={logout}
          >
            <Logout />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
