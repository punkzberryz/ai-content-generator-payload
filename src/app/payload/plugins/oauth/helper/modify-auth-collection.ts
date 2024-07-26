import { CollectionConfig } from 'payload'
import { OAuthPluginTypes } from '../types'
import { createAuthorizeEndpoint, createCallbackEndpoint } from './auth-endpoints'

export const modifyAuthCollection = (
  pluginOptions: OAuthPluginTypes,
  existingCollectionConfig: CollectionConfig,
  subFieldName: string,
) => {
  // /////////////////////////////////////
  // modify fields
  // /////////////////////////////////////
  //ADD subFieldName field to the collection such as googleId or lineId
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
