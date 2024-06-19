import axios from 'axios';
import { useEffect, useState } from 'react';
import url from '../../../../url';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import Title from '../../../components/General/Title';
import { Link } from 'react-router-dom';

const Modules = () => {
  const [data, setData] = useState(undefined);
  const [display, setDisplay] = useState(undefined);
  const [search, setSearch] = useState('');

  const fetchData = () => {
    axios.get(`${url}moduli`).then(function (response) {
      setData(response.data);
      setDisplay(response.data);
    });
  };

  const filterData = (obj) => {
    if (obj.nosaukums.toLowerCase().includes(search.toLowerCase())) {
      return obj;
    }
  };

  useEffect(() => {
    if (search != '') {
      setDisplay(data.filter(filterData));
    } else {
      setDisplay(data);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = (moduleID, arrEl) => {
    axios.delete(url + 'moduli/' + moduleID).then((res) => {
      if (res.statusText == 'OK') {
        const temp = [...data];
        temp.splice(arrEl, 1);
        setData(temp);
        setDisplay(temp);
      }
    });
  };

  return (
    <>
      <Title text="Moduļi" />
      <TextField
        value={search}
        onChange={handleChange}
        placeholder="Meklēt pēc nosaukuma"
        sx={{ mb: '2%' }}
        variant="outlined"
      />
      {data != undefined ? (
        <Grid container spacing={2}>
          {display.map((item, i) => {
            return (
              <Grid item xs={4} key={item.moduli_id}>
                <Card
                  variant="outlined"
                  sx={{
                    display: 'flex',
                    height: '15vh',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ flex: 1, alignContent: 'center' }}>
                    <Typography
                      sx={{
                        textAlign: 'center',
                      }}
                    >
                      {item.nosaukums}
                    </Typography>
                  </Box>
                  <ButtonGroup sx={{ width: '100%' }}>
                    <Button
                      variant="outlined"
                      sx={{ width: '50%' }}
                      onClick={() => handleDelete(item.moduli_id, i)}
                    >
                      Dzēst <Delete />
                    </Button>
                    <Link
                      to={`edit/${item.moduli_id}`}
                      style={{ width: '50%' }}
                    >
                      <Button variant="outlined" sx={{ width: '100%' }}>
                        Rediģēt <Edit />
                      </Button>
                    </Link>
                  </ButtonGroup>
                </Card>
              </Grid>
            );
          })}
          <Grid item xs={4}>
            <Link to={`create`} style={{ textDecoration: 'none' }}>
              <Card
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  height: '15vh',
                  background: 'linear-gradient(45deg, orange, orangered)',
                  color: 'background.default',
                }}
              >
                <Add /> Pievienot
              </Card>
            </Link>
          </Grid>
        </Grid>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default Modules;
