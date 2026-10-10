import { Navigate, Outlet } from 'react-router-dom'

import { selectIsAuthorized } from '@/entities/session'
import { useAppSelector } from '@/shared/lib'

export const RequireAuth = () => {
  const isAuthorized = useAppSelector(selectIsAuthorized)
  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />
}

export const RequireGuest = () => {
  const isAuthorized = useAppSelector(selectIsAuthorized)
  return isAuthorized ? <Navigate to="/" replace /> : <Outlet />
}
