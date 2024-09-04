import { useEffect, useState } from 'react'
import { AuthSession, getUserAuth } from '@/lib/auth/utils'

export function useAuth() {
  const [session, setSession] = useState<AuthSession['session']>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserAuth().then((auth) => {
      setSession(auth.session)
      setLoading(false)
    })
  }, [])

  return {
    session,
    loading,
    hasRole: (role: string) => session?.user?.roles?.includes(role),
    hasAnyRole: (roles: string[]) => session?.user?.roles?.some(role => roles.includes(role)),
  }
}