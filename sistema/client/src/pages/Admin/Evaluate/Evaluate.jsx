import axios from 'axios';
import { useEffect, useState } from 'react';
import url from '../../../../url';
import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link } from 'react-router-dom';

const Evaluate = () => {
  const [fetchState, setFetchState] = useState({
    pending: true,
    failed: false,
  });
  const [data, setData] = useState(null);
  const fetchTasks = () => {
    setFetchState({ pending: true, failed: false });
    axios
      .get(url + 'custom/taskInfo')
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

  useEffect(() => {
    fetchTasks();
  }, []);
  useEffect(() => {
    if (data !== null) {
      console.log(data);
    }
  }, [data]);

  return (
    <>
      <Paper
        sx={{
          width: 9000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'normal',
          alignItems: 'center',
          ...((fetchState.pending && { justifyContent: 'center' }) ||
            (fetchState.failed && { justifyContent: 'center' })),
          p: '5%',
        }}
      >
        {data ? (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Skolēns/Studens</TableCell>
                    <TableCell align="center">Skola</TableCell>
                    <TableCell align="center">Klase/Kurss</TableCell>
                    <TableCell align="center">Uzdevuma nosaukums</TableCell>
                    <TableCell align="center">Darbības</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell align="center">
                          {`${item.vards} ${item.uzvards}`}
                        </TableCell>
                        <TableCell align="center">{item.skola}</TableCell>
                        <TableCell align="center">{`${item.klase}.${
                          item.tips == 'Tehnikums' || item.tips == 'Augstskola'
                            ? 'kurss'
                            : 'klase'
                        }`}</TableCell>
                        <TableCell align="center">{item.nosaukums}</TableCell>
                        <TableCell align="center">
                          <Link to={`/evaluate/task/${item.iesniegumi_id}`}>
                            <Button>
                              <AssignmentIcon />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <CircularProgress />
        )}
      </Paper>
    </>
  );
};

export default Evaluate;
