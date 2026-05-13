import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import { LoadingFallback } from '@/components/shared/LoadingFallback'

// Lazy load pages
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Reports = lazy(() => import('@/pages/Reports'))
const Education = lazy(() => import('@/pages/Education'))
const ArticleDetail = lazy(() => import('@/pages/ArticleDetail'))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const SignupPage = lazy(() => import('@/features/auth/pages/SignupPage'))

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/signup',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SignupPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'reports',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Reports />
          </Suspense>
        ),
      },
      {
        path: 'education',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Education />
          </Suspense>
        ),
      },
      {
        path: 'education/:slug',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ArticleDetail />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: <div className="p-10 text-center">Page Not Found</div>,
      },
    ],
  },
])
