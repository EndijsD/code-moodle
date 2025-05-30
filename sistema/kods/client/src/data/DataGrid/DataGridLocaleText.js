export const LocaleText = {
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
    labelDisplayedRows: ({ from, to, count }) => `${from} - ${to} no ${count}`,
    getItemAriaLabel: (type) =>
      `Iet uz ${type == 'next' ? 'nākamo' : 'iepriekšējo'} lappusi`,
  },
  noRowsLabel: 'Nav datu!',
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} rindas izvēlētas`
      : `${count.toLocaleString()} rinda izvēlēta`,
}

export const LocaleTextEvaluate = {
  ...LocaleText,
  noRowsLabel: 'Nav iesniegumu ko vērtēt',
}

export const LocaleTextStudent = {
  ...LocaleText,
  noRowsLabel: 'Nav pieņemtu lietotāju!',
}
