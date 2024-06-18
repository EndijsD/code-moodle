import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import url from '../../../../url';
import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import Title from '../../../components/General/Title';

const EditModule = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const [search, setSearch] = useState({
    tema: '',
    nos: '',
    valoda: '',
    punkti: '',
  });
  const [changed, setChanged] = useState(null);
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState(null);
  const [allTasks, setAllTasks] = useState(null);
  const [checkbox, setCheckbox] = useState(null);
  const [status, setStatus] = useState({
    pending: true,
    error: false,
  });
  let tempArr = [];
  let tempArr2 = [];
  const fetchData = () => {
    axios.get(`${url}moduli/${id}`).then(function (res) {
      setInput(res.data[0].nosaukums);

      axios
        .get(`${url}uzdevumi/`)
        .then(function (res) {
          setAllTasks(res.data);
          for (let i = 0; i < res.data.length; i++) {
            tempArr[i] = [res.data[i].uzdevumi_id, 'off'];
            tempArr2[i] = false;
          }
          axios
            .get(`${url}custom/tasks_of_module/${id}`)
            .then(function (res) {
              setTasks(res);
              setStatus({ pending: false, error: false });
              for (let k = 0; k < tempArr.length; k++) {
                for (let i = 0; i < res.data.length; i++) {
                  if (tempArr[k][0] == res.data[i].uzdevumi_id) {
                    tempArr[k][1] = 'on';
                  }
                }
              }
              setChanged(tempArr2);
              setCheckbox(tempArr);
            })
            .catch(function (error) {
              console.log(error);
              setStatus({ pending: false, error: true });
            });
        })
        .catch(function (error) {
          console.log(error);
          setStatus({ pending: false, error: true });
        });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch({
      ...search,
      [name]: value,
    });
  };

  const handleCheckbox = (e) => {
    let { value, name } = e.target;
    let temp = [...checkbox];
    let temp2 = [...changed];
    temp[Number(name)][1] = value == 'on' ? 'off' : 'on';
    setCheckbox(temp);
    temp2[Number(name)] = !changed[Number(name)];
    setChanged(temp2);
  };

  const handleSubmit = () => {
    axios
      .patch(`${url}moduli/${id}`, { nosaukums: input })
      .then(function (res) {
        for (let i = 0; i < allTasks.length; i++) {
          if (checkbox[i][1] == 'off' && changed[i] == true) {
            axios.delete(`${url}custom/removeTask/${id}/${checkbox[i][0]}`);
          } else if (checkbox[i][1] == 'on' && changed[i] == true) {
            let temp = { uzdevumi_id: checkbox[i][0], moduli_id: id };
            axios.post(`${url}moduli_uzdevumi`, temp);
          }
        }
        nav('/admin/modules');
      });
  };

  return (
    <Paper
      sx={{
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 4,
        px: 4,
      }}
    >
      <Title text="Moduļa rediģēšana" />
      {status.pending ? (
        <CircularProgress />
      ) : status.error ? (
        <Typography>Servera kļūda!</Typography>
      ) : input != '' && tasks != null ? (
        <Box sx={{ width: '100%' }}>
          <TextField fullWidth value={input} onChange={handleChange} />
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              my: 4,
              fontWeight: 'bold',
              width: '100%',
              py: 2,
              background: 'linear-gradient(45deg, orange, orangered)',
              color: 'background.default',
            }}
          >
            Uzdevumi
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                my: 4,
                fontWeight: 'bold',
                width: '20%',
                py: 2,
                background: 'linear-gradient(45deg, orange, orangered)',
                color: 'background.default',
              }}
            >
              Filtrēšana
            </Typography>
            <TextField
              onChange={handleSearchChange}
              value={search.tema}
              name="tema"
              variant="standard"
              placeholder="Tēma"
            />
            <TextField
              onChange={handleSearchChange}
              value={search.nos}
              name="nos"
              variant="standard"
              placeholder="Uzdevums"
            />
            <TextField
              onChange={handleSearchChange}
              value={search.valoda}
              name="valoda"
              variant="standard"
              placeholder="Programmēšanas valoda"
            />
            <TextField
              onChange={handleSearchChange}
              value={search.punkti}
              name="punkti"
              variant="standard"
              placeholder="Punkti"
            />
          </Box>
          <Grid container spacing={2}>
            {allTasks != null &&
              checkbox != null &&
              allTasks.map((item, i) => {
                return (
                  <Grid
                    item
                    xs={4}
                    key={item.uzdevumi_id}
                    sx={{
                      display:
                        search.tema != '' &&
                        !item.tema
                          .toLowerCase()
                          .includes(search.tema.toLowerCase())
                          ? 'none'
                          : search.tema == '' &&
                            'block' &&
                            search.nos != '' &&
                            !item.nosaukums
                              .toLowerCase()
                              .includes(search.nos.toLowerCase())
                          ? 'none'
                          : search.nos == '' &&
                            'block' &&
                            search.valoda != '' &&
                            !item.valoda
                              .toLowerCase()
                              .includes(search.valoda.toLowerCase())
                          ? 'none'
                          : search.valoda == '' &&
                            'block' &&
                            search.punkti != '' &&
                            !item.punkti
                              .toString()
                              .includes(search.punkti.toLowerCase())
                          ? 'none'
                          : search.punkti == '' && 'block',
                    }}
                  >
                    <Card
                      sx={{
                        boxShadow: 6,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minHeight: '20vh',
                      }}
                      variant="outlined"
                    >
                      <Checkbox
                        name={`${i}`}
                        value={checkbox[i][1]}
                        onClick={handleCheckbox}
                        checked={checkbox[i][1] == 'on' ? true : false}
                      />
                      <Box sx={{ width: '100%', p: 1 }}>
                        <Typography>Tēma: {item.tema}</Typography>
                        <Typography>Uzdevums: {item.nosaukums}</Typography>
                        <Typography>
                          Programmēšanas valoda: {item.valoda}
                        </Typography>
                        <Typography>Punkti: {item.punkti}</Typography>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
          <Button
            variant="outlined"
            onClick={handleSubmit}
            fullWidth
            sx={{ mt: 4 }}
          >
            Iesniegt
          </Button>
        </Box>
      ) : (
        <Typography>Nav uzdevumu!</Typography>
      )}
    </Paper>
  );
};

export default EditModule;
