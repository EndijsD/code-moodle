import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Landing from './pages/General/Landing';
import Login from './pages/General/Login';
import Register from './pages/General/Register';
import NotFound from './pages/General/NotFound';
import createStore from 'react-auth-kit/createStore';
import AuthProvider from 'react-auth-kit';
import ProtectedRoute from './ProtectedRoute';
import SideBar from './components/Admin/SideBar';
import NewTask from './pages/Admin/NewTask';
import Bank from './pages/Admin/Bank';
import Student from './pages/Admin/Student';
import EditTask from './pages/Admin/EditTask';
import UserHeader from './components/User/Header';
import Tasks from './pages/User/Tasks';
import Evaluate from './pages/Admin/Evaluate';
import SingleTask from './pages/General/SingleTask';
import Modules from './pages/Admin/Modules';
import Assign from './pages/Admin/Assign';
import NewModule from './pages/Admin/NewModule';
import EditModule from './pages/Admin/EditModule';

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: false,
});

const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />
      <Box
        sx={{
          m: '32px 10%',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          alignItems: 'center',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

const UserLayout = () => {
  return (
    <>
      <UserHeader />
      <Box
        sx={{
          m: '32px 10%',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          alignItems: 'center',
        }}
      >
        <Outlet />
      </Box>
    </>
  );
};

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
            index: true,
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
        path: 'admin',
        element: <AdminLayout />,
        children: [
          // {
          // index: true,
          // element: <AdminHome />,
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
            path: 'assign',
            children: [
              {
                index: true,
                element: <Assign />,
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
            children: [
              {
                index: true,
                element: <Assign />,
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
            children: [
              {
                index: true,
                element: <Assign />,
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
            children: [
              {
                index: true,
                element: <Assign />,
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
            index: true,
            path: '*',
            element: <NotFound link={'students'} />,
          },
        ],
      },
    ],
  },
]);

function App() {
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#ff4500',
      },
      background: {
        default: '#fdfdfd',
      },
    },
    typography: {
      fontFamily: '"Prompt", sans-serif',
    },
  });

  return (
    <AuthProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  );
}
export default App;
