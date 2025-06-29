"use client"

import { ReactNode } from 'react'
import { useUserRoles } from '@/hooks/useUserRoles'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Shield, AlertTriangle } from 'lucide-react'

interface RoleGuardProps {
  children: ReactNode
  requiredRoles: string[]
  fallback?: ReactNode
  redirectTo?: string
}

export function RoleGuard({ 
  children, 
  requiredRoles, 
  fallback,
  redirectTo = '/dashboard'
}: RoleGuardProps) {
  const { roles, loading, hasAnyRole } = useUserRoles()
  const router = useRouter()

  const hasAccess = hasAnyRole(requiredRoles)

  // Show loading while checking roles
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Checking permissions...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show access denied if user doesn't have required roles
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">
                You don't have permission to access this page. Required roles: {requiredRoles.join(', ')}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Your current roles: {roles.length > 0 ? roles.join(', ') : 'None'}
              </p>
              <Button onClick={() => router.push(redirectTo)}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Higher-order component for role-based protection
export function withRoleGuard<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles: string[],
  fallback?: ReactNode,
  redirectTo?: string
) {
  return function ProtectedComponent(props: P) {
    return (
      <RoleGuard requiredRoles={requiredRoles} fallback={fallback} redirectTo={redirectTo}>
        <Component {...props} />
      </RoleGuard>
    )
  }
} 