import {
  People,
  Assignment,
  Create,
  AssignmentInd,
  Widgets,
  Groups,
  Person,
} from '@mui/icons-material'

export const links = [
  { path: 'students', title: 'Pieņemšana', icon: <People /> },
  { path: 'bank', title: 'Uzdevumu Banka', icon: <Assignment /> },
  { path: 'modules', title: 'Moduļi', icon: <Widgets /> },
  { path: 'assign', title: 'Uzdošana', icon: <AssignmentInd /> },
  { path: 'evaluate', title: 'Vērtēšana', icon: <Create /> },
  { path: 'studentProfiles', title: 'Studenti', icon: <Groups /> },
  { path: 'profile', title: 'Profils', icon: <Person /> },
]
