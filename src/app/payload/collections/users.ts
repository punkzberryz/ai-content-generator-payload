import { CollectionConfig } from 'payload'
import { isAdmin, isMeOrAdmin } from '../helper'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: isMeOrAdmin,
    update: isMeOrAdmin,
    delete: isMeOrAdmin,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      defaultValue: 'user',
      saveToJWT: true,
    },
    {
      name: 'email',
      type: 'email',
      saveToJWT: true,
      unique: true,
    },
    {
      name: 'displayName',
      type: 'text',
      required: true,
    },
  ],
  auth: {
    tokenExpiration: 7200, // How many seconds to keep the user logged in
  },

  timestamps: true,
}
