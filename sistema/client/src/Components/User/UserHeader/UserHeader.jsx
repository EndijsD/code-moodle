import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const navItems = ['Uzdevumi', 'Vertējumi', 'Profils'];
const navItemLinks = ['/tasks', '/grades', '/profile'];

function UserHeader() {
  return (
    <AppBar>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          NOSAUKUMS
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {navItems.map((item, i) => (
            <Link to={navItemLinks[i]}>
              <Button key={item} sx={{ color: '#fff' }}>
                {item}
              </Button>
            </Link>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default UserHeader;
