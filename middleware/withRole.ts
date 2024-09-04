// middleware/withRoles.ts
import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/lucia'

export function withRoles(handler: (req: NextRequest) => Promise<NextResponse>, allowedRoles: string[]) {
  return async (req: NextRequest) => {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }

    const hasAllowedRole = (await user).roles.some(role => allowedRoles.includes(role))

    if (!hasAllowedRole) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    return handler(req)
  }
}