import { Access } from 'payload'

export const isAdminOrCreatedBy: Access = ({ req: { user }, data }) => {
  if (!user) return false
  //if the user is an admin, they have access
  if (user.role === 'admin') return true
  //if the user created the document, they have access
  return {
    createdBy: {
      equals: user.id,
    },
  }
}
export const isAdmin: Access = ({ req: { user } }) => (user && user.role === 'admin') || false

export const isMeOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return {
    id: {
      equals: user.id,
    },
  }
}
