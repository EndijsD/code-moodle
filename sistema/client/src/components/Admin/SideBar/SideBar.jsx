import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { Sidebar, Menu, MenuItem, sidebarClasses } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  People,
  Assignment,
  Create,
  Logout,
  AssignmentInd,
  Widgets,
} from '@mui/icons-material';
import { useState } from 'react';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
const links = [
  // { path: '', title: 'Sākumlapa', icon: <Home /> },
  { path: 'students', title: 'Studenti', icon: <People /> },
  { path: 'bank', title: 'Uzdevumu Banka', icon: <Assignment /> },
  { path: 'modules', title: 'Moduļi', icon: <Widgets /> },
  { path: 'assign', title: 'Uzdošana', icon: <AssignmentInd /> },
  { path: 'evaluate', title: 'Vērtēšana', icon: <Create /> },
];

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const theme = useTheme();
  const location = useLocation();
  const signOut = useSignOut();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

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
  };

  return (
    <Sidebar
      collapsed={isSmallScreen ? true : collapsed}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      backgroundColor=""
      style={{
        background: 'linear-gradient(45deg, orange, orangered)',
        color: 'white',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
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
          variant="h4"
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
                  ) == 'admin' &&
                    !link.path)
                }
              >
                {link.title}
              </MenuItem>
            );
          })}
        </Menu>
      </div>
      <Menu style={{ alignSelf: !isSmallScreen && !collapsed && 'center' }}>
        <MenuItem
          component={<Link to="/" />}
          icon={<Logout />}
          onClick={() => signOut()}
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
  );
};

export default SideBar;
