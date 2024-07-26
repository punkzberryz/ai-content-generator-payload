'use client'

import { SignInSchema } from '@/app/schema/auth'
import { responseErrorHelper } from '@/lib/error'
import { catchErrorForServerActionHelper } from '@/lib/error/catch-error-action-helper'
import { User } from 'payload'

export const login = async ({ body }: { body: SignInSchema }) => {
  try {
    const req = await fetch('/api/users/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!req.ok) {
      return responseErrorHelper(req.status)
    }
    const data = (await req.json()) as LoginResp

    return {
      user: {
        ...data.user,
        collection: undefined,
        createdAt: new Date(data.user.createdAt),
        updatedAt: new Date(data.user.updatedAt),
      },
      error: null,
    }
  } catch (err) {
    let error = catchErrorForServerActionHelper(err)
    if (error.code === 401) {
      error.message = SignInErrorResponse.passwordOrEmailIsNotMatch
      return { error }
    }
    return { error, user: null }
  }
}
interface LoginResp {
  message: string
  token: string
  exp: number
  user: User
}
export enum SignInErrorResponse {
  passwordOrEmailIsNotMatch = 'password or email is incorrect',
}
export const logout = async () => {
  try {
    const req = await fetch('/api/users/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!req.ok) {
      return responseErrorHelper(req.status)
    }
    await req.json()
    return {}
  } catch (err) {
    const error = catchErrorForServerActionHelper(err)
    return { error }
  }
}

export const refreshToken = async () => {
  try {
    const req = await fetch('{cms-url}/api/{user-collection}/refresh-token', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!req.ok) {
      return responseErrorHelper(req.status)
    }
    const data = await req.json()
    console.log({ data })
    return data
  } catch (err) {
    const error = catchErrorForServerActionHelper(err)
    return { error }
  }
}

export const getCurrentUser = async () => {
  try {
    const req = await fetch('{cms-url}/api/{user-collection}/me', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!req.ok) {
      return responseErrorHelper(req.status)
    }
    const data = await req.json()
  } catch (err) {
    const error = catchErrorForServerActionHelper(err)
    return { error }
  }
}
