import { useState, useEffect } from 'react'

export function useUserRoles() {
  const [roles, setRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/user/roles')
        if (response.ok) {
          const data = await response.json()
          setRoles(data.roles || [])
        }
      } catch (error) {
        console.error('Error fetching user roles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
  }, [])

  const hasRole = (role: string) => roles.includes(role)
  const hasAnyRole = (roleList: string[]) => roleList.some(role => roles.includes(role))

  return { roles, loading, hasRole, hasAnyRole }
} 