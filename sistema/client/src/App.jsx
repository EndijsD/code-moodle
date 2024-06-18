import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Landing from './pages/General/Landing';
import Login from './pages/General/Login';
import Register from './pages/General/Register';
// import UserHome from './pages/User/Home'; No reason to import pages if we're not going to use them
// import AdminHome from './pages/Admin/Home';
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
import Profile from './pages/User/Profile';
import Tasks from './pages/User/Tasks';
import Evaluate from './pages/Admin/Evaluate';
import EvaluateItem from './pages/Admin/EvaluateItem';
import Modules from './pages/Admin/Modules/Modules';
import Assign from './pages/Admin/Assign/Assign';
import NewModule from './pages/Admin/NewModule/NewModule';
import EditModule from './pages/Admin/EditModule';

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: false,
});

const AdminLayout = () => {
  return (
    <div id="adminLayout">
      <SideBar />
      <Outlet />
    </div>
  );
};

const UserLayout = () => {
  return (
    <>
      <UserHeader />
      <Box sx={{ m: 4, height: '100%' }}>
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
            index: true,
            // element: <UserHome />,
            element: <Tasks />,
          },
          // {
          //   path: 'tasks',
          //   element: <Tasks />,
          // },
          {
            path: 'grades',
            element: <div>To be implemented - Grades</div>,
          },
          // {
          //   path: 'profile',
          //   element: <Profile />,
          // },
          {
            path: '*',
            element: <NotFound />,
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
          {
            index: true,
            // element: <AdminHome />,
            element: <Student />,
          },
          // {
          //   path: 'student',
          //   element: <Student />,
          // },
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
              {
                index: true,
                element: <Bank />,
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
                path: 'task/:id',
                element: <EvaluateItem />,
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
            path: '*',
            element: <NotFound />,
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
