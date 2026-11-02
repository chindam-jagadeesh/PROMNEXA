import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { supabaseConfigured } from '../lib/firebase'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="screen-center"><span className="loader" />Checking session…</div>
  if (!supabaseConfigured) return <Navigate to="/auth" replace state={{ from: location }} />
  if (!user) return <Navigate to="/auth" replace state={{ from: location }} />

  return <>{children}</>
}