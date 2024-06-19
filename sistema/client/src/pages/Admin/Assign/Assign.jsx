import { Box, Button, CircularProgress, Typography } from '@mui/material';
import Title from '../../../components/General/Title';
import { useEffect, useState } from 'react';
import axios from 'axios';
import url from '../../../../url';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import DoneIcon from '@mui/icons-material/Done';

const Assign = () => {
  const nav = useNavigate();
  const [students, setStudents] = useState(null);
  const [modules, setModules] = useState(null);
  const [selected, setSelected] = useState({ students: [], modules: [] });
  const [localeText, setLocaleText] = useState({
    columnHeaderSortIconLabel: 'Šķirot',
    columnMenuLabel: 'Opcijas',
    columnMenuSortAsc: 'Šķirot augoši',
    columnMenuSortDesc: 'Šķirot dilstoši',
    columnMenuUnsort: 'Nešķirot',
    columnMenuFilter: 'Filtrēt',
    columnMenuHideColumn: 'Paslēpt kolonnas',
    columnMenuManageColumns: 'Pārvaldīt kolonnas',
    filterPanelColumns: 'Kolonnas',
    filterPanelOperator: 'Operators',
    filterPanelInputLabel: 'Vērtība',
    filterPanelDeleteIconLabel: 'Izdzēst',
    filterPanelInputPlaceholder: 'Filtrēšanas vērtība',
    filterOperatorContains: 'satur',
    filterOperatorEquals: 'vienāds',
    filterOperatorStartsWith: 'sākas ar',
    filterOperatorEndsWith: 'beidzas ar',
    filterOperatorIsEmpty: 'ir tukšs',
    filterOperatorIsNotEmpty: 'nav tukšs',
    filterOperatorIsAnyOf: 'ir jebkurš no',
    columnsPanelTextFieldLabel: 'Atrast kolonnu',
    columnsPanelTextFieldPlaceholder: 'Kolonnas nosaukums',
    columnsPanelShowAllButton: 'Rādīt visu',
    columnsPanelHideAllButton: 'Paslēpt visu',
    MuiTablePagination: {
      labelRowsPerPage: 'Rindas lapā:',
      labelDisplayedRows: ({ from, to, count }) =>
        `${from} - ${to} no ${count}`,
      getItemAriaLabel: (type) =>
        `Iet uz ${type == 'next' ? 'nākamo' : 'iepriekšējo'} lappusi`,
    },
    noRowsLabel: 'Nav datu!',
    footerRowSelected: (count) =>
      count !== 1
        ? `${count.toLocaleString()} rindas izvēlētas`
        : `${count.toLocaleString()} rinda izvēlēta`,
  });

  const [status, setStatus] = useState({
    pending: true,
    error: false,
    success: false,
  });

  const studentColumns = [
    { field: 'studenti_id', headerName: 'ID', flex: 1, minWidth: 150 },
    { field: 'vards', headerName: 'Vārds', flex: 1, minWidth: 150 },
    { field: 'uzvards', headerName: 'Uzvārds', flex: 1, minWidth: 150 },
    { field: 'skola', headerName: 'Skola', flex: 1, minWidth: 150 },
    {
      field: 'klase',
      flex: 1,
      minWidth: 150,
      headerName: 'Klase/Kurss',
      valueGetter: (value, row) => {
        return `${row.klase}.${
          row.tips == 'Tehnikums' || row.tips == 'Augstskola'
            ? 'kurss'
            : 'klase'
        }`;
      },
    },
  ];

  const moduleColumns = [
    { field: 'moduli_id', headerName: 'Moduļa ID', flex: 1, minWidth: 375 },
    {
      field: 'nosaukums',
      headerName: 'Moduļa nosaukums',
      flex: 1,
      minWidth: 375,
    },
  ];

  const fetchData = () => {
    axios
      .get(`${url}custom/generalStudentInfo`)
      .then(function (res) {
        setStudents(res.data);
      })
      .catch(function (err) {
        setStatus({ pending: false, error: true, success: false });
      });
    axios
      .get(`${url}moduli`)
      .then(function (res) {
        setModules(res.data);
        setStatus({ pending: false, error: false, success: false });
      })
      .catch(function (err) {
        setStatus({ pending: false, error: true, success: false });
      });
  };

  const getStudentRowId = (row) => {
    return row.studenti_id;
  };

  const getModuleRowId = (row) => {
    return row.moduli_id;
  };

  const handleSubmit = () => {
    for (let i = 0; i < selected.students.length; i++) {
      for (let k = 0; k < selected.modules.length; k++) {
        let postObj = {
          studenti_id: selected.students[i],
          moduli_id: selected.modules[k],
        };
        axios
          .post(`${url}custom/studentModules`, postObj)
          .catch(function (err) {
            setStatus({ pending: false, error: true, success: false });
          });
      }
    }
    if (status.error != true) {
      setStatus({ pending: false, error: false, success: true });
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
    nav('/admin/assign');
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {status.pending ? (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      ) : status.error ? (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography>Servera kļūda!</Typography>
        </Box>
      ) : students != null && modules != null ? (
        <>
          <Title text="Moduļu uzdošana" />
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
            Studenti
          </Typography>
          <DataGrid
            checkboxSelection
            getRowId={getStudentRowId}
            rows={students}
            columns={studentColumns}
            onRowSelectionModelChange={(ids) => {
              setSelected({ ...selected, students: ids });
            }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            localeText={localeText}
            sx={{
              '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-columnHeaderTitleContainer': {
                justifyContent: 'center',
              },
            }}
          />
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
            Moduļi
          </Typography>
          <DataGrid
            checkboxSelection
            getRowId={getModuleRowId}
            rows={modules}
            columns={moduleColumns}
            onRowSelectionModelChange={(ids) => {
              setSelected({ ...selected, modules: ids });
            }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            localeText={localeText}
            sx={{
              '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-columnHeaderTitleContainer': {
                justifyContent: 'center',
              },
            }}
          />
          <Button
            color={status.success ? 'success' : 'primary'}
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            sx={{ mt: 4 }}
          >
            {status.success ? <DoneIcon /> : `Iesniegt`}
          </Button>
        </>
      ) : (
        <Typography>Servera kļūda!</Typography>
      )}
    </>
  );
};

export default Assign;
