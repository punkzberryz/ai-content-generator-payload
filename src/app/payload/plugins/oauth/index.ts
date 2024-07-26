import { Config, Plugin } from 'payload'
import { OAuthPluginTypes } from './types'
import { modifyAuthCollection } from '../helper/modify-auth-collection'

export const OAuthPlugin =
  (pluginOptions: OAuthPluginTypes): Plugin =>
  (incomingConfig) => {
    let config = { ...incomingConfig }

    // /////////////////////////////////////
    // Modify admin panel
    // /////////////////////////////////////
    const afterLogin = config.admin?.components?.afterLogin || []
    if (pluginOptions.OAuthLoginButton) {
      afterLogin.push(pluginOptions.OAuthLoginButton)
    }
    config.admin = {
      ...(config.admin || {}),
      // Add additional admin config here
      components: {
        ...(config.admin?.components || {}),
        // Add additional admin components here
        afterLogin,
      },
    }

    // /////////////////////////////////////
    // Modify auth collection
    // /////////////////////////////////////

    const authCollectionSlug = pluginOptions.authCollection || 'users'
    const subFieldName = pluginOptions.subFieldName
    const authCollection = config.collections?.find(
      (collection) => collection.slug === authCollectionSlug,
    )

    if (!authCollection) {
      throw new Error(`The collection with the slug "${authCollectionSlug}" was not found.`)
    }

    const modifiedAuthCollection = modifyAuthCollection(pluginOptions, authCollection, subFieldName)

    config.collections = [
      ...(config.collections?.filter((collection) => collection.slug !== authCollectionSlug) || []),
      modifiedAuthCollection,
    ]

    return config
  }
