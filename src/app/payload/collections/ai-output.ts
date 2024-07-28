import { CollectionConfig } from 'payload'
import { isAdminOrCreatedBy } from '../helper'

export const AiOutputCollection: CollectionConfig = {
  slug: 'ai-output',
  access: {
    read: isAdminOrCreatedBy,
    update: isAdminOrCreatedBy,
    delete: isAdminOrCreatedBy,
  },
  fields: [
    {
      name: 'prompt',
      type: 'text',
      required: true,
    },
    {
      name: 'output',
      type: 'text',
    },
    {
      name: 'templateSlug',
      type: 'text',
      required: true,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      index: true,
      access: {
        update: () => false,
      },
      admin: {
        readOnly: true,
        position: 'sidebar',
        //this will hind the field until it has a value
        condition: (data) => Boolean(data?.createdBy),
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      //this will set the createdBy field to the current user id
      ({ req, operation, data }) => {
        if (operation === 'create') {
          if (req.user) {
            data.createdBy = req.user.id
            return data
          }
        }
      },
    ],
  },
}
