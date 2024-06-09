import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import UserMainPage from './pages/UserHome';
import AdminMainPage from './pages/AdminHome';
import NotFound from './pages/NotFound';
import createStore from 'react-auth-kit/createStore';
import AuthProvider from 'react-auth-kit';
import RequireAuth from '@auth-kit/react-router/RequireAuth';
import ProtectedRoute from './ProtectedRoute';

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: false,
});

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
        path: '/userpage',
        element: <UserMainPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute role={1} />,
    children: [
      {
        path: '/adminpage',
        element: <AdminMainPage />,
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
