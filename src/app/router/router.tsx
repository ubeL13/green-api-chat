import { createBrowserRouter, Navigate } from 'react-router-dom'

import { RequireAuth, RequireGuest } from './guards'
import { RouteError } from './RouteError'

export const router = createBrowserRouter([
  {
    errorElement: <RouteError />,
    children: [
      {
        element: <RequireGuest />,
        children: [
          {
            path: '/login',
            lazy: async () => ({ Component: (await import('@/pages/login')).LoginPage }),
          },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: '/',
            lazy: async () => ({ Component: (await import('@/pages/chat')).ChatPage }),
          },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
