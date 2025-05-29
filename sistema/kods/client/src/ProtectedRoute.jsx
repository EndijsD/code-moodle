import React from 'react';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const ProtectedRoute = ({ role }) => {
  const isAuth = useIsAuthenticated();
  const auth = useAuthUser();
  if (!isAuth || auth.userType !== role) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
