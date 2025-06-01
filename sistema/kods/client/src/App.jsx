import {
  Box,
  CircularProgress,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Landing from './pages/General/Landing'
import Login from './pages/General/Login'
import Register from './pages/General/Register'
import NotFound from './pages/General/NotFound'
import ProtectedRoute from './ProtectedRoute'
import SideBar from './components/Teacher/SideBar'
import NewTask from './pages/Teacher/NewTask'
import Bank from './pages/Teacher/Bank'
import Student from './pages/Teacher/Student'
import EditTask from './pages/Teacher/EditTask'
import UserHeader from './components/Student/Header'
import AccordionModules from './pages/Student/AccordionModules'
import Evaluate from './pages/Teacher/Evaluate'
import SingleTask from './pages/General/SingleTask'
import Modules from './pages/Teacher/Modules'
import Assign from './pages/Teacher/Assign'
import NewModule from './pages/Teacher/NewModule'
import EditModule from './pages/Teacher/EditModule'
import StudentProfiles from './pages/Teacher/StudentProfiles/StudentProfiles'
import * as S from './style'
import { themeStyle } from './theme'
import Profile from './pages/General/Profile/Profile'
import { useGlobalContext } from './context/GlobalProvider'
import Teachers from './pages/Admin/Teachers/Teachers'
import Admins from './pages/Admin/Admins/Admins'
import AdminHeader from './components/Admin/Header'

const TeacherLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />
      <Box sx={S.TeacherLayout}>
        <Outlet />
      </Box>
    </Box>
  )
}

const StudentLayout = () => {
  return (
    <>
      <UserHeader />

      <Box sx={S.StudentLayout}>
        <Outlet />
      </Box>
    </>
  )
}

const AdminLayout = () => {
  return (
    <>
      <AdminHeader />

      <Box sx={S.StudentLayout}>
        <Outlet />
      </Box>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    element: <ProtectedRoute role='students' />,
    children: [
      {
        path: '/student',
        element: <StudentLayout />,
        children: [
          {
            // index: true,
            // element: <UserHome />,
          },
          {
            path: 'modules',
            children: [
              {
                index: true,
                element: <AccordionModules />,
              },
              {
                path: ':moduleID/tasks/:taskID',
                element: <SingleTask />,
              },
            ],
          },
          // {
          //   path: 'grades',
          //   element: <div>To be implemented - Grades</div>,
          // },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: '*',
            element: <NotFound link='modules' />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute role='skolotajs' />,
    children: [
      {
        path: 'teacher',
        element: <TeacherLayout />,
        children: [
          // {
          // index: true,
          // element: <TeacherHome />,
          // },
          {
            path: 'students',
            element: <Student />,
          },
          {
            path: 'bank',
            children: [
              {
                index: true,
                element: <Bank />,
              },
              {
                path: 'newTask',
                element: <NewTask />,
              },
              {
                path: 'editTask/:id',
                element: <EditTask />,
              },
            ],
          },
          {
            path: 'modules',
            children: [
              {
                index: true,
                element: <Modules />,
              },
              {
                path: 'edit/:id',
                element: <EditModule />,
              },
              {
                path: 'create',
                element: <NewModule />,
              },
            ],
          },
          {
            path: 'assign',
            element: <Assign />,
          },
          {
            path: 'evaluate',
            children: [
              {
                index: true,
                element: <Evaluate />,
              },
              {
                path: ':subID',
                element: <SingleTask />,
              },
            ],
          },
          {
            path: 'studentProfiles',
            children: [
              {
                index: true,
                element: <StudentProfiles />,
              },
              {
                path: ':studentID',
                element: <AccordionModules />,
              },
            ],
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: '*',
            element: <NotFound link='students' />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute role='administrators' />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          {
            path: 'Admins',
            element: <Admins />,
          },
          {
            path: 'Teachers',
            element: <Teachers />,
          },
          {
            path: '*',
            element: <NotFound link='modules' />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

function App() {
  const theme = createTheme(themeStyle)
  const { initialized } = useGlobalContext()

  return initialized ? (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  ) : (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}
    >
      <CircularProgress />
    </Box>
  )
}
export default App
