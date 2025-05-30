export const studentColumns = [
  { field: 'studenti_id', headerName: 'ID', flex: 1, minWidth: 1 },
  { field: 'vards', headerName: 'Vārds', flex: 1, minWidth: 1 },
  { field: 'uzvards', headerName: 'Uzvārds', flex: 1, minWidth: 1 },
  { field: 'skola', headerName: 'Skola', flex: 1, minWidth: 1 },
  {
    field: 'klase',
    flex: 1,
    minWidth: 1,
    headerName: 'Klase/Kurss',
    valueGetter: (value, row) => {
      return `${row.klase}.${
        row.tips == 'Tehnikums' || row.tips == 'Augstskola' ? 'kurss' : 'klase'
      }`
    },
  },
]

export const moduleColumns = [
  { field: 'moduli_id', headerName: 'Moduļa ID', flex: 1, minWidth: 1 },
  {
    field: 'nosaukums',
    headerName: 'Moduļa nosaukums',
    flex: 1,
    minWidth: 1,
  },
]
