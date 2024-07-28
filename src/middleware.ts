import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { decodeJwt } from 'jose'
import { cookies } from 'next/headers'

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const path = req.nextUrl.pathname
  console.log('middleware path:', path)
  if (path.startsWith('/admin')) {
    return adminProtection(req)
  }
  if (path === '/logout') {
    //Admin unauth logout will redirect user to /logout
    //but we don't have /loutout page so we redirect to the origin
    const origin = req.nextUrl.origin
    return NextResponse.redirect(origin)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/admin/:path*', '/auth/:path*', '/logout'],
}

function adminProtection(req: NextRequest) {
  if (req.nextUrl.pathname === '/admin/login' || req.nextUrl.pathname === '/admin/unauthorized') {
    //if the user is trying to login, they can continue
    return NextResponse.next()
  }
  const token = cookies().get('ai-content-token')?.value
  if (!token) {
    //if the user does not have a token, they are not an admin
    return NextResponse.error()
  }

  const payload: Payload = decodeJwt(token)
  if (payload.role !== 'admin') {
    const origin = req.nextUrl.origin
    return NextResponse.redirect(origin + '/admin/unauthorized')
  }
  return NextResponse.next()
}
interface Payload {
  role: string
  [key: string]: any
}
