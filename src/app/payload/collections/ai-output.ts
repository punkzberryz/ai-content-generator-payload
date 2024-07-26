import { CollectionConfig } from 'payload'

export const AiOutputCollection: CollectionConfig = {
  slug: 'ai-output',
  fields: [
    {
      name: 'prompt',
      type: 'text',
      required: true,
    },
    {
      name: 'output',
      type: 'richText',
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
    },
  ],
  timestamps: true,
}
