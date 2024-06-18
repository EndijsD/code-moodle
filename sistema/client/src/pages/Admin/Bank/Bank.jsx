import {
  Button,
  ButtonGroup,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import url from '../../../../url';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Bank = () => {
  const [fetchState, setFetchState] = useState({
    pending: true,
    failed: false,
  });
  const [data, setData] = useState(null);

  const fetchBankItems = () => {
    setFetchState({ pending: true, failed: false });
    axios
      .get(url + 'uzdevumi')
      .then(function (response) {
        setData(response.data);
        setFetchState({
          ...fetchState,
          pending: false,
        });
      })
      .catch(function (error) {
        setFetchState({
          failed: true,
          pending: false,
        });
        console.log(error);
      });
  };

  const deleteTask = (id, itemId) => {
    axios.delete(url + 'task/' + id).then(function () {
      const temp = [...data];
      temp.splice(itemId, 1);
      setData(temp);
    });
  };

  useEffect(() => {
    fetchBankItems();
  }, []);

  return (
    <Paper
      sx={{
        width: 9000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'normal',
        alignItems: 'center',
        ...((fetchState.pending && { justifyContent: 'center' }) ||
          (fetchState.failed && { justifyContent: 'center' })),
        p: '5% 10%',
      }}
    >
      {fetchState.pending ? (
        <CircularProgress />
      ) : fetchState.failed ? (
        <>Servera kļūda!</>
      ) : (
        <Link to="newTask">
          <Button variant="outlined">Jauns uzdevums</Button>
        </Link>
      )}
      {!fetchState.failed && !fetchState.pending && data != null ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Tēma</TableCell>
                <TableCell align="center">Uzdevuma nosaukum</TableCell>
                <TableCell align="center">Programmēsanas valoda</TableCell>
                <TableCell align="center">Punkti</TableCell>
                <TableCell align="center">Darbības</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data !== null &&
                data.map((item, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell align="center">{item.tema}</TableCell>
                      <TableCell align="center">{item.nosaukums}</TableCell>
                      <TableCell align="center">{item.valoda}</TableCell>
                      <TableCell align="center">{item.punkti}</TableCell>
                      <TableCell align="center">
                        <ButtonGroup variant="contained">
                          <Link to={`editTask/${item.uzdevumi_id}`}>
                            <Button>
                              <EditIcon />
                            </Button>
                          </Link>
                          <Button
                            onClick={() => deleteTask(item.uzdevumi_id, i)}
                          >
                            <DeleteIcon />
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        !fetchState.pending && <Typography>Nav izveidoti uzdevumi</Typography>
      )}
    </Paper>
  );
};

export default Bank;
