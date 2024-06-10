import { Typography } from '@mui/material';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

const links = {
  root: 'Sākumlapa',
  students: 'Studenti',
  bank: 'Uzdevumu Banka',
  evaluate: 'Vērtēšana',
};

const SideBar = () => {
  return (
    <Sidebar>
      <Typography variant="h4" sx={{ textAlign: 'center', p: 2 }}>
        <Link style={{ color: 'inherit', textDecoration: 'inherit' }}>
          Nosaukums
        </Link>
      </Typography>
      <Menu>
        {Object.entries(links).map(([key, value]) => {
          return (
            <MenuItem
              key={key}
              component={<Link to={key == 'root' ? '' : key} />}
            >
              {value}
            </MenuItem>
          );
        })}
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
