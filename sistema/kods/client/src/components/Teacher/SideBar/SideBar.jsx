import { Typography, useMediaQuery, useTheme } from '@mui/material'
import { Sidebar, Menu, MenuItem, sidebarClasses } from 'react-pro-sidebar'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Logout } from '@mui/icons-material'
import { useState } from 'react'
import * as S from './style'
import { links } from './links'
import { useGlobalContext } from '../../../context/GlobalProvider'
import axios from 'axios'

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(true)
  const theme = useTheme()
  const location = useLocation()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'))
  const { setUser } = useGlobalContext()
  const nav = useNavigate()

  const menuItemStyles = {
    button: {
      '&:hover': {
        fontWeight: 'bold',
        color: theme.palette.text.primary,
      },
      [`&.ps-active`]: {
        boxShadow: 'inset 5px 0 white',
      },
    },
  }

  const logout = () => {
    axios.post(`auth/logout`).finally(() => {
      setUser(null)
      nav('/')
    })
  }

  return (
    <Sidebar
      collapsed={isSmallScreen ? true : collapsed}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      backgroundColor=''
      style={S.SideBarStyle}
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <div>
        <Typography
          variant='h4'
          sx={{
            textAlign: 'center',
            py: 4,
            fontWeight: (isSmallScreen || collapsed) && 'bold',
            textWrap: 'nowrap',
            textShadow: '1px 1px 1px ' + theme.palette.text.primary,
          }}
        >
          <Link
            to={'students'}
            style={{ color: 'inherit', textDecoration: 'inherit' }}
          >
            {isSmallScreen || collapsed ? 'CM' : 'Code Moodle'}
          </Link>
        </Typography>
        <Menu menuItemStyles={menuItemStyles}>
          {links.map((link) => {
            return (
              <MenuItem
                key={link.path}
                component={<Link to={link.path} />}
                icon={link.icon}
                active={
                  location.pathname.substring(
                    location.pathname.lastIndexOf('/') + 1
                  ) == link.path ||
                  (location.pathname.substring(
                    location.pathname.lastIndexOf('/') + 1
                  ) == 'teacher' &&
                    !link.path)
                }
              >
                {link.title}
              </MenuItem>
            )
          })}
        </Menu>
      </div>
      <Menu style={{ alignSelf: !isSmallScreen && !collapsed && 'center' }}>
        <MenuItem
          // component={<Link to='/' />}
          icon={<Logout />}
          onClick={logout}
          style={{
            borderRadius: 50,
            margin: '32px 5px',
            fontWeight: 'bold',
            color: theme.palette.text.primary,
            backgroundColor: '#f3f3f3',
          }}
        >
          Izlogoties
        </MenuItem>
      </Menu>
    </Sidebar>
  )
}

export default SideBar
