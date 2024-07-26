import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  return NextResponse.json({ config })
}
const config = {
  url: process.env.NEXT_PUBLIC_URL,
  nexturl: process.env.NEXT_PUBLIC_VERCEL_URL,
  env: process.env.NODE_ENV,
  vercelEnv: process.env.VERCEL_ENV,
  googleCallback: process.env.GOOGLE_CALLBACK_URL,
  githubCallback: process.env.GITHUB_CALLBACK_URL,
}
