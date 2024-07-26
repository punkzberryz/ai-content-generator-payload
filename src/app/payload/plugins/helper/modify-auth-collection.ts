import { SignJWT } from 'jose'
import { CollectionConfig, Endpoint, generatePayloadCookie, getFieldsToSign } from 'payload'
import { OAuthPluginTypes } from '../oauth/types'
import { Line, generateCodeVerifier, generateState } from 'arctic'
import { cookies } from 'next/headers'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
export const modifyAuthCollection = (
  pluginOptions: OAuthPluginTypes,
  existingCollectionConfig: CollectionConfig,
  subFieldName: string,
) => {
  // /////////////////////////////////////
  // modify fields
  // /////////////////////////////////////
  const fields = existingCollectionConfig.fields || []
  const existingSubField = fields.find((field) => 'name' in field && field.name === subFieldName)
  if (!existingSubField) {
    fields.push({
      name: subFieldName,
      type: 'text',
      index: true,
      access: {
        read: () => true,
        create: () => true,
        update: () => false,
      },
    })
  }

  // /////////////////////////////////////
  // modify endpoints
  // /////////////////////////////////////
  const endpoints = existingCollectionConfig.endpoints || []
  endpoints.push(createAuthorizeEndpoint(pluginOptions))
  endpoints.push(createCallbackEndpoint(pluginOptions))
  return {
    ...existingCollectionConfig,
    endpoints,
  }
}

const createAuthorizeEndpoint = (pluginOptions: OAuthPluginTypes): Endpoint => {
  return {
    method: 'get',
    path: pluginOptions.authorizePath || '/oauth/authorize',
    handler: async (req) => {
      const { email } = req.query

      if (typeof email === 'string' && email.length > 1) {
        const parse = z.string().email().safeParse(email)
        if (!parse.success) {
          return new Response('Invalid email', { status: 400 })
        }
        cookies().set('payload_signup_email', email, {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
          maxAge: 60 * 10,
          sameSite: 'lax',
        })
      }

      const callbackUrl = `${pluginOptions.serverURL}/api/${pluginOptions.authCollection}${pluginOptions.callbackPath}`
      const line = new Line(pluginOptions.clientId, pluginOptions.clientSecret, callbackUrl)

      const state = generateState()
      const codeVerifier = generateCodeVerifier()
      const url = await line.createAuthorizationURL(state, codeVerifier, {
        scopes: ['profile', 'email'],
      })

      cookies().set('line_oauth_state', state, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: 'lax',
      })
      cookies().set('line_oauth_code_verifier', codeVerifier, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: 'lax',
      })

      return Response.redirect(url)
    },
  }
}
const createCallbackEndpoint = (pluginOptions: OAuthPluginTypes): Endpoint => {
  return {
    method: 'get',
    path: pluginOptions.callbackPath || '/oauth/callback',
    handler: async (req) => {
      try {
        const { code, state }: { code?: string; state?: string } = req.query
        const storedState = cookies().get('line_oauth_state')?.value ?? null
        const storedCodeVerifier = cookies().get('line_oauth_code_verifier')?.value ?? null

        if (!code || !state || !storedState || state !== storedState || !storedCodeVerifier) {
          throw new Error('Invalid state or code')
        }
        // /////////////////////////////////////
        // shorthands
        // /////////////////////////////////////
        const subFieldName = pluginOptions.subFieldName || 'sub'
        const authCollection = pluginOptions.authCollection || 'users'
        const collectionConfig = req.payload.collections[authCollection].config

        // /////////////////////////////////////
        // beforeOperation - Collection
        // /////////////////////////////////////
        // Not implemented
        // /////////////////////////////////////
        // obtain access token
        // /////////////////////////////////////
        const callbackUrl = `${pluginOptions.serverURL}/api/${pluginOptions.authCollection}${pluginOptions.callbackPath}`
        const line = new Line(pluginOptions.clientId, pluginOptions.clientSecret, callbackUrl)

        const token = await line.validateAuthorizationCode(code, storedCodeVerifier)
        // /////////////////////////////////////
        // get user info
        // /////////////////////////////////////
        const lineUserResponse = await fetch('https://api.line.me/oauth2/v2.1/userinfo', {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        })

        if (!lineUserResponse.ok) throw new Error('Failed to get user info')

        const lineUser: LineUser = await lineUserResponse.json()

        //search for existing user

        let existingUser = await req.payload.find({
          req,
          collection: 'users',
          where: {
            [subFieldName]: { equals: lineUser.sub },
          },
          limit: 1,
        })
        let user: any
        if (existingUser.docs.length === 0) {
          //get email from cookie
          const email = cookies().get('payload_signup_email')?.value

          if (!email) {
            console.log('Email is required')
            //redirect to signup page
            return new Response(null, {
              headers: {
                'Content-Type': 'application/json',
                Location: '/auth/signup?emailRequired=true',
              },
              status: 302,
            })
            // throw new Error('Email is required')
          }
          //create new user
          user = await req.payload.create({
            req,
            collection: 'users',
            data: {
              [subFieldName]: lineUser.sub,
              email,
              displayName: lineUser.name,
              // Stuff breaks when password is missing
              password: makeid(32),
            },
          })
        } else {
          user = existingUser.docs[0]
        }
        console.log({ user })
        // /////////////////////////////////////
        // beforeLogin - Collection
        // /////////////////////////////////////
        await collectionConfig.hooks.beforeLogin.reduce(async (priorHook, hook) => {
          await priorHook
          user =
            (await hook({
              collection: collectionConfig,
              context: req.context,
              req,
              user,
            })) || user
        }, Promise.resolve())
        console.log('before login passed...')
        // /////////////////////////////////////
        // login - OAuth2
        // /////////////////////////////////////
        const fieldsToSign = getFieldsToSign({
          collectionConfig,
          email: user.email,
          user,
        })
        const iat = Math.floor(Date.now() / 1000)
        const payloadToken = jwt.sign(fieldsToSign, req.payload.secret, {
          expiresIn: collectionConfig.auth.tokenExpiration,
        })
        // const payloadToken = await new SignJWT(fieldsToSign)
        //   .setIssuedAt(iat)
        //   .setExpirationTime(collectionConfig.auth.tokenExpiration)
        //   .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        //   .sign(new TextEncoder().encode(req.payload.secret))
        req.user = user
        console.log({ payloadToken })

        // /////////////////////////////////////
        // afterLogin - Collection
        // /////////////////////////////////////
        await collectionConfig.hooks.afterLogin.reduce(async (priorHook, hook) => {
          await priorHook

          user =
            (await hook({
              collection: collectionConfig,
              context: req.context,
              req,
              token: payloadToken,
              user,
            })) || user
        }, Promise.resolve())

        // /////////////////////////////////////
        // afterRead - Fields
        // /////////////////////////////////////
        // Not implemented

        // /////////////////////////////////////
        // generate and set cookie
        // /////////////////////////////////////
        const cookie = generatePayloadCookie({
          collectionConfig,
          payload: req.payload,
          token: payloadToken,
        })

        // /////////////////////////////////////
        // success redirect
        // /////////////////////////////////////
        return new Response(null, {
          headers: {
            'Set-Cookie': cookie,
            Location: await pluginOptions.successRedirect(req),
          },
          status: 302,
        })
      } catch (err: any) {
        console.log({ message: 'failllll', err: err?.message })
        // /////////////////////////////////////
        // failure redirect
        // /////////////////////////////////////
        return new Response(null, {
          headers: {
            'Content-Type': 'application/json',
            Location: await pluginOptions.failureRedirect(req, err),
          },
          status: 302,
        })
      }
    },
  }
}
interface LineUser {
  sub: string
  name: string
  picture: string
  email?: string
}

function makeid(length: number) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

/*
{
  "id": 2,
  "collection": "users",
  "email": "kang-nakub@hotmail.com",
  "exp": 7200,
  "iat": 1721983184,
  "nbf": 1721983184
}
*/
