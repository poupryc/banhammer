import * as d from 'discord.js'

import { permission as base } from '../permission'

export type Permission = {
  type: 'role' | 'user' | 'default'
  level: number
  bypass?: boolean
}

/**
 * Extract permission from discord message
 * @param message message
 */
export function permissionFromMessage(message: d.Message) {
  const { member, author } = message
  return permission({ member, author })
}

type BuildPermission = {
  member?: d.GuildMember
  author?: d.User
}

/**
 * Build permission object
 * @param data data to build permission
 */
export function permission({ member, author }: BuildPermission = {}) {
  const getBypass = (user: d.User) => base.get(user.id)

  const permission: Permission[] = []

  if (member) {
    member.roles.forEach(role => {
      const actual = base.get(role.id)

      if (actual !== undefined) {
        permission.push({ level: actual, type: 'role' })
      }
    })
  }

  const user = author ? author : member ? member.user : null

  if (user) {
    const accred = getBypass(user)
    if (typeof accred === 'number') permission.push({ level: accred, type: 'user' })
  }

  return permission.reduce((p, c) => (p.level > c.level ? p : c), {
    level: 0,
    type: 'default'
  })
}
