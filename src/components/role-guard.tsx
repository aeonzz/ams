import { redirect } from 'next/navigation'
import { validateRequest } from '@/lib/auth/lucia'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export async function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user } = await validateRequest()

  if (!user) {
    redirect('/sign-in')
  }

  const userRoles = Array.isArray((await user).roles) ? (await user).roles : []

  const hasAllowedRole = userRoles.some(role => allowedRoles.includes(role))

  if (!hasAllowedRole) {
    redirect('/unauthorized')
  }

  return <>{children}</>
}