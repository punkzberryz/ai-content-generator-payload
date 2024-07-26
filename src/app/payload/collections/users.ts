import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
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
