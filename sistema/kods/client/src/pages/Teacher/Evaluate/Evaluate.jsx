import axios from 'axios';
import { useEffect, useState } from 'react';
import url from '../../../../url';
import { Box, Button, CircularProgress, Paper } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Title from '../../../components/General/Title';

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

  const columns = [
    { field: 'vards', headerName: 'Vārds', flex: 1, minWidth: 200 },
    { field: 'uzvards', headerName: 'Uzvārds', flex: 1, minWidth: 200 },
    { field: 'skola', headerName: 'Skola', flex: 1, minWidth: 200 },
    {
      field: 'klase',
      flex: 1,
      minWidth: 200,
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
      field: 'nosaukums',
      flex: 1,
      minWidth: 200,
      headerName: 'Uzdevuma nosaukums',
    },
    {
      field: 'darbibas',
      flex: 1,
      minWidth: 200,
      align: 'center',
      headerName: 'Darbības',
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={params.row.iesniegumi_id.toString()}>
            <Button variant="contained">
              <AssignmentIcon />
            </Button>
          </Link>
        );
      },
    },
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  const getRowId = (row) => {
    return row.iesniegumi_id;
  };

  return (
    <>
      {data ? (
        <>
          <Title text="Vērtēšana" />
          <DataGrid
            getRowId={getRowId}
            rows={data}
            columns={columns}
            autosizeOptions={{
              columns: [
                'Vārds',
                'Uzvārds',
                'Skola',
                'Klase/Kurss',
                'Uzdevuma nosaukums',
                'Darbības',
              ],
            }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            localeText={{
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
              noRowsLabel: 'Nav iesniegumu ko vērtēt',
            }}
            disableRowSelectionOnClick
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
        <Box sx={{ height: '100%', alignContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default Evaluate;
