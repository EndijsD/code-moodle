import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Landing from './pages/General/Landing'
import Login from './pages/General/Login'
import Register from './pages/General/Register'
import NotFound from './pages/General/NotFound'
import createStore from 'react-auth-kit/createStore'
import AuthProvider from 'react-auth-kit'
import ProtectedRoute from './ProtectedRoute'
import SideBar from './components/Teacher/SideBar'
import NewTask from './pages/Teacher/NewTask'
import Bank from './pages/Teacher/Bank'
import Student from './pages/Teacher/Student'
import EditTask from './pages/Teacher/EditTask'
import UserHeader from './components/User/Header'
import Tasks from './pages/User/Tasks'
import Evaluate from './pages/Teacher/Evaluate'
import SingleTask from './pages/General/SingleTask'
import Modules from './pages/Teacher/Modules'
import Assign from './pages/Teacher/Assign'
import NewModule from './pages/Teacher/NewModule'
import EditModule from './pages/Teacher/EditModule'
import StudentProfiles from './pages/Teacher/StudentProfiles/StudentProfiles'
import * as S from './style'
import { theme } from './theme'

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: false,
})

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

const UserLayout = () => {
  return (
    <>
      <UserHeader />
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
    errorElement: <NotFound />,
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
    element: <ProtectedRoute role={0} />,
    children: [
      {
        path: '/user',
        element: <UserLayout />,
        children: [
          {
            // index: true,
            // element: <UserHome />,
          },
          {
            path: 'tasks',
            children: [
              {
                index: true,
                element: <Tasks />,
              },
              {
                path: ':moduleID/:taskID',
                element: <SingleTask />,
              },
            ],
          },
          // {
          //   path: 'grades',
          //   element: <div>To be implemented - Grades</div>,
          // },
          // {
          //   path: 'profile',
          //   element: <Profile />,
          // },
          {
            path: '*',
            element: <NotFound link={'tasks'} />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute role={1} />,
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
                element: <Tasks />,
              },
            ],
          },
          {
            path: '*',
            element: <NotFound link={'students'} />,
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
  const theme = createTheme(theme)

  return (
    <AuthProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  )
}
export default App
