import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Link, useNavigate } from 'react-router-dom'
import { Logout } from '@mui/icons-material'
import useSignOut from 'react-auth-kit/hooks/useSignOut'
import { links } from './links'
import * as S from './style'
import { useTheme } from '@emotion/react'
import axios from 'axios'

const UserHeader = () => {
  // const signOut = useSignOut()
  const theme = useTheme()
  const nav = useNavigate()

  const logout = async () => {
    axios.post(`/auth/logout`).finally(() => nav('/login'))
  }

  return (
    <AppBar sx={S.AppBar}>
      <Toolbar>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          <Link to={'tasks'} style={S.LogoLink}>
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
          <Link
            style={{ ...S.LogOut, color: theme.palette.text.primary }}
            to='/'
            onClick={logout}
          >
            <Logout />
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default UserHeader
