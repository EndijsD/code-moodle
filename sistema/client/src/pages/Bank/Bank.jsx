import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Bank = () => {
  return (
    <>
      <Link to="newTask">
        <Button variant="outlined">Jauns uzdevums</Button>
      </Link>
    </>
  );
};

export default Bank;
