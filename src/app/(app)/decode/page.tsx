import { cookies } from 'next/headers'
import React from 'react'
import jwtDecoder from 'jsonwebtoken'
import { apiPromise } from '@/lib/api'
import { jwtVerify } from 'jose'
const DecodePage = async () => {
  const jwt = cookies().get('ai-content-token')?.value ?? null
  if (!jwt) return <div>JWT not found</div>
  const decoded = jwtDecoder.decode(jwt)
  console.log({ decoded })
  let verify: any
  const api = await apiPromise()
  console.log({ secret: api.secret })
  try {
    let verify = jwtDecoder.verify(jwt, api.secret || '')
    console.log({ verify })
  } catch (err: any) {
    verify = ''
    console.log({ message: 'verify failed', err: err.message })
    // console.log({ err })
  }
  try {
    const { payload } = await jwtVerify(jwt, new TextEncoder().encode(api.secret || ''))
    console.log({ payload })
  } catch (err: any) {
    console.log({ message: 'verify failed', err: err.message })
  }
  return (
    <div>
      DecodePage
      <p>{jwt}</p>
      <p>decoded</p>
      <p>{decoded?.toString()}</p>
    </div>
  )
}

export default DecodePage
