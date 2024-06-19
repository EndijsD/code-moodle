import { DataGrid } from '@mui/x-data-grid';
import Title from '../../../components/General/Title';
import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import url from '../../../../url';
import { Link } from 'react-router-dom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
const StudentProfiles = () => {
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
    noRowsLabel: 'Nav pieņemtu lietotāju!',
  });

  const [students, setStudents] = useState(null);
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
    {
      field: 'darbibas',
      flex: 1,
      minWidth: 200,
      align: 'center',
      headerName: 'Veikto darbu apskate',
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={params.row.studenti_id.toString()}>
            <Button variant="contained">
              <AccountBoxIcon />
            </Button>
          </Link>
        );
      },
    },
  ];

  const fetchData = () => {
    axios
      .get(`${url}custom/generalStudentInfo`)
      .then(function (res) {
        setStudents(res.data);
        setStatus({ pending: false, error: false, success: false });
      })
      .catch(function (err) {
        setStatus({ pending: false, error: true, success: false });
      });
  };

  const getStudentRowId = (row) => {
    return row.studenti_id;
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
      ) : students != null ? (
        <>
          <Title text="Studenti" />
          <DataGrid
            getRowId={getStudentRowId}
            rows={students}
            columns={studentColumns}
            disableRowSelectionOnClick
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
        </>
      ) : (
        <Typography>Servera kļūda!</Typography>
      )}
    </>
  );
};

export default StudentProfiles;
