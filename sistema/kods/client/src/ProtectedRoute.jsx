import React from 'react'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import { useGlobalContext } from './context/GlobalProvider'

const ProtectedRoute = ({ role }) => {
  const { user } = useGlobalContext()

  if (!user) {
    return <Navigate to='/login' replace />
  }

  return <Outlet />
}

export default ProtectedRoute
