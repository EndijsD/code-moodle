import { Navigate, Outlet } from 'react-router-dom'
import { useGlobalContext } from './context/GlobalProvider'

const ProtectedRoute = ({ role }) => {
  const { user } = useGlobalContext()

  if (!user || user.loma !== role) return <Navigate to='/login' replace />

  return <Outlet />
}

export default ProtectedRoute
