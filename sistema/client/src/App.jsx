import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import UserMainPage from './pages/UserHome';
import AdminMainPage from './pages/AdminHome';
import NotFound from './pages/NotFound';

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
    path: '/userpage',
    element: <UserMainPage />,
  },
  {
    path: '/adminpage',
    element: <AdminMainPage />,
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
export default App;
