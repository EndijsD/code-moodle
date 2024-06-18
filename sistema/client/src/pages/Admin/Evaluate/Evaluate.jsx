import axios from 'axios';
import { useEffect, useState } from 'react';
import url from '../../../../url';
import { Button, CircularProgress, Paper } from '@mui/material';
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
      description: 'This column has a value getter and is not sortable.',
    },
    {
      field: 'darbibas',
      flex: 1,
      minWidth: 200,
      headerName: 'Darbības',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`task/${params.row.iesniegumi_id}`}>
            <Button>
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
  useEffect(() => {
    if (data !== null) {
      console.log(data);
    }
  }, [data]);

  function getRowId(row) {
    return row.iesniegumi_id;
  }

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
        py: '1%',
      }}
    >
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
              includeHeaders: false,
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
            }}
          />
        </>
      ) : (
        <CircularProgress />
      )}
    </Paper>
  );
};

export default Evaluate;
