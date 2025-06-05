import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Link, useNavigate } from 'react-router-dom'
import { Logout, Person } from '@mui/icons-material'
import * as S from './style'
import { useTheme } from '@emotion/react'
import axios from 'axios'
import { useGlobalContext } from '../../../context/GlobalProvider'
import { IconButton } from '@mui/material'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'

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
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Typography variant='h6'>
            <Link to={'modules'} style={S.LogoLink}>
              Code Moodle
            </Link>
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '1vw',
              alignItems: 'center',
            }}
          >
            <Button
              style={{ color: theme.palette.common.white, gap: 8 }}
              onClick={() => nav('/student/modules')}
            >
              <FormatListBulletedIcon />
              Uzdevumi
            </Button>
            <Button
              style={{ color: theme.palette.common.white, gap: 8 }}
              onClick={() => nav('/student/signup')}
            >
              <Person />
              Pieteikšanās
            </Button>
            <Button
              style={{ color: theme.palette.common.white, gap: 8 }}
              onClick={() => nav('/student/profile')}
            >
              <Person />
              Profils
            </Button>
          </Box>
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

export default Header
