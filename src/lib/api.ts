import payloadConfig from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

export const apiPromise = cache(() => getPayload({ config: payloadConfig }))
