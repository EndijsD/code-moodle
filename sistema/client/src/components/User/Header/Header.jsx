import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { Assignment, Grade, Home, Logout, Person } from '@mui/icons-material';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useTheme } from '@mui/material';

const links = [
  { path: '', title: 'Sākumlapa', icon: <Home /> },
  { path: 'tasks', title: 'Uzdevumi', icon: <Assignment /> },
  { path: 'grades', title: 'Vertējumi', icon: <Grade /> },
  { path: 'profile', title: 'Profils', icon: <Person /> },
];

const UserHeader = () => {
  const theme = useTheme();
  const signOut = useSignOut();

  return (
    <AppBar
      sx={{
        background: 'linear-gradient(45deg, orange, orangered)',
        position: 'sticky',
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link style={{ color: 'inherit', textDecoration: 'inherit' }}>
            Code Moodle
          </Link>
        </Typography>
        <Box>
          {links.map((link) => (
            <Link to={link.path} key={link.path}>
              <Button
                sx={{
                  color: '#fff',
                  textTransform: 'none',
                  gap: '3px',
                  lineHeight: '1px',
                }}
              >
                {link.icon}
                {link.title}
              </Button>
            </Link>
          ))}
          <Link
            style={{
              background: '#fff',
              color: theme.palette.text.primary,
              display: 'inline-flex',
              verticalAlign: 'middle',
              borderRadius: '50px',
              padding: '.3rem',
              marginLeft: '15px',
            }}
            to="/"
            onClick={() => signOut()}
          >
            <Logout />
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default UserHeader;
