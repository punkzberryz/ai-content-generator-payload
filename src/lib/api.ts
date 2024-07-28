import payloadConfig from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'

export const apiPromise = getPayloadHMR({ config: payloadConfig })
