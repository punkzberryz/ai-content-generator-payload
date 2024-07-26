import { OAuthPluginTypes } from '../types'
import { Endpoint, generatePayloadCookie, getFieldsToSign } from 'payload'
import { Line, generateCodeVerifier, generateState } from 'arctic'
import { cookies } from 'next/headers'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
export const createAuthorizeEndpoint = (pluginOptions: OAuthPluginTypes): Endpoint => {
  return {
    method: 'get',
    path: pluginOptions.authorizePath,
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

      const state = generateState()
      const codeVerifier = generateCodeVerifier()

      cookies().set(`${pluginOptions.subFieldName}_state`, state, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: 'lax',
      })
      cookies().set(`${pluginOptions.subFieldName}_verifier`, codeVerifier, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: 'lax',
      })

      return await getRedirectURL({
        subfield: pluginOptions.subFieldName,
        clientId: pluginOptions.clientId,
        clientSecret: pluginOptions.clientSecret,
        callbackUrl,
        state,
        codeVerifier,
      })
    },
  }
}

export const createCallbackEndpoint = (pluginOptions: OAuthPluginTypes): Endpoint => {
  return {
    method: 'get',
    path: pluginOptions.callbackPath,
    handler: async (req) => {
      try {
        const { code, state }: { code?: string; state?: string } = req.query
        const storedState = cookies().get(`${pluginOptions.subFieldName}_state`)?.value ?? null
        const storedCodeVerifier =
          cookies().get(`${pluginOptions.subFieldName}_verifier`)?.value ?? null

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
        // obtain access token and user info
        // /////////////////////////////////////
        const callbackUrl = `${pluginOptions.serverURL}/api/${pluginOptions.authCollection}${pluginOptions.callbackPath}`

        const {
          sub,
          displayName,
          email: emailFromOauth,
        } = await verifyAndGetProfile({
          callbackUrl,
          clientId: pluginOptions.clientId,
          clientSecret: pluginOptions.clientSecret,
          code,
          storedCodeVerifier,
          subfield: pluginOptions.subFieldName,
        })

        //search for existing user

        let existingUser = await req.payload.find({
          req,
          collection: 'users',
          where: {
            [subFieldName]: { equals: sub },
          },
          limit: 1,
        })
        let user: any
        if (existingUser.docs.length === 0) {
          //get email from cookie
          const email = cookies().get('payload_signup_email')?.value ?? emailFromOauth

          if (!email) {
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
              [subFieldName]: sub,
              email,
              displayName,
              // Stuff breaks when password is missing
              password: makeid(32),
            },
          })
        } else {
          user = existingUser.docs[0]
        }

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

        // /////////////////////////////////////
        // login - OAuth2
        // /////////////////////////////////////
        const fieldsToSign = getFieldsToSign({
          collectionConfig,
          email: user.email,
          user,
        })
        // const iat = Math.floor(Date.now() / 1000)
        const payloadToken = jwt.sign(fieldsToSign, req.payload.secret, {
          expiresIn: collectionConfig.auth.tokenExpiration,
        })
        // const payloadToken = await new SignJWT(fieldsToSign)
        //   .setIssuedAt(iat)
        //   .setExpirationTime(collectionConfig.auth.tokenExpiration)
        //   .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        //   .sign(new TextEncoder().encode(req.payload.secret))
        req.user = user

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

async function getRedirectURL({
  subfield,
  callbackUrl,
  clientId,
  clientSecret,
  codeVerifier,
  state,
}: {
  subfield: OAuthPluginTypes['subFieldName']
  clientId: OAuthPluginTypes['clientId']
  clientSecret: OAuthPluginTypes['clientSecret']
  callbackUrl: string
  state: string
  codeVerifier: string
}) {
  if (subfield === 'lineLoginId') {
    const line = new Line(clientId, clientSecret, callbackUrl)

    const url = await line.createAuthorizationURL(state, codeVerifier, {
      scopes: ['profile', 'email'],
    })
    return Response.redirect(url)
  }
  throw new Error('Invalid subfield')
}

async function verifyAndGetProfile({
  subfield,
  callbackUrl,
  clientId,
  clientSecret,
  code,
  storedCodeVerifier,
}: {
  subfield: OAuthPluginTypes['subFieldName']
  clientId: OAuthPluginTypes['clientId']
  clientSecret: OAuthPluginTypes['clientSecret']
  callbackUrl: string
  code: string
  storedCodeVerifier: string
}): Promise<{
  sub: string
  email?: string
  displayName: string
}> {
  switch (subfield) {
    case 'lineLoginId': {
      const line = new Line(clientId, clientSecret, callbackUrl)
      const token = await line.validateAuthorizationCode(code, storedCodeVerifier)
      const lineUserResponse = await fetch('https://api.line.me/oauth2/v2.1/userinfo', {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      })

      if (!lineUserResponse.ok) throw new Error('Failed to get user info')

      const lineUser: LineUser = await lineUserResponse.json()
      return {
        sub: lineUser.sub,
        email: lineUser.email,
        displayName: lineUser.name,
      }
    }
    default:
      throw new Error('Invalid subfield')
  }
}
interface LineUser {
  sub: string
  name: string
  picture: string
  email?: string
}
