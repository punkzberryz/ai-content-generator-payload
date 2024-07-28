import path from 'path'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { en } from 'payload/i18n/en'
import { th } from 'payload/i18n/th'
import {
  AlignFeature,
  BlockquoteFeature,
  BlocksFeature,
  BoldFeature,
  ChecklistFeature,
  HeadingFeature,
  IndentFeature,
  InlineCodeFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  RelationshipFeature,
  UnorderedListFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
//import { slateEditor } from '@payloadcms/richtext-slate'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { Users } from '@/app/payload/collections/users'
import { AiOutputCollection } from '@/app/payload/collections/ai-output'
import { OAuthPlugin } from '@/app/payload/plugins/oauth'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  //editor: slateEditor({}),
  editor: lexicalEditor(),
  collections: [Users, AiOutputCollection],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URI || '',
    },
  }),

  /**
   * Payload can now accept specific translations from 'payload/i18n/en'
   * This is completely optional and will default to English if not provided
   */
  i18n: {
    supportedLanguages: { en, th },
  },

  admin: {
    autoLogin: {
      email: 'dev@payloadcms.com',
      password: 'test',
      prefillOnly: true,
    },
  },
  async onInit(payload) {
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (existingUsers.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'dev@payloadcms.com',
          password: 'test',
          displayName: 'Admin',
          role: 'admin',
        },
      })
    }
  },
  // Sharp is now an optional dependency -
  // if you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.

  // This is temporary - we may make an adapter pattern
  // for this before reaching 3.0 stable
  sharp,
  cookiePrefix: 'ai-content',
  plugins: [
    OAuthPlugin({
      subFieldName: 'lineLoginId',
      authCollection: 'users',
      serverURL: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
      clientId: process.env.LINE_CLIENT_ID || '',
      clientSecret: process.env.LINE_CLIENT_SECRET || '',
      authorizePath: '/oauth/line',
      callbackPath: '/oauth/line/callback',
      // OAuthLoginButton: OAuthLineLoginButton,
      failureRedirect: (req, error) => {
        return '/'
      },
      successRedirect: async (req) => {
        return '/auth/signin'
      },
    }),
    OAuthPlugin({
      subFieldName: 'githubId',
      authCollection: 'users',
      serverURL: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      authorizePath: '/oauth/github',
      callbackPath: '/oauth/github/callback',
      // OAuthLoginButton: OAuthLineLoginButton,
      failureRedirect: (req, error) => {
        return '/'
      },
      successRedirect: async (req) => {
        return '/auth/signin'
      },
    }),
    OAuthPlugin({
      subFieldName: 'googleId',
      authCollection: 'users',
      serverURL: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorizePath: '/oauth/google',
      callbackPath: '/oauth/google/callback',
      // OAuthLoginButton: OAuthLineLoginButton,
      failureRedirect: (req, error) => {
        return '/'
      },
      successRedirect: async (req) => {
        return '/auth/signin'
      },
    }),
  ],
})
