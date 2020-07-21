import { plugin } from '@hershel/plugin'

import { Banhammer } from '../types'

export type Roles = Map<string, string>

/**
 * Roles for the banhammer
 */
export const roles: Roles = new Map()
  .set('muted', '417334957279674368')
  .set('member', '417334522775076864')
  .set('int', '417348223443664896')
  .set('guest', '725685643765874728')

/**
 * Roles injection plugin
 * @param instance banhammer
 */
const rolePlugin: Banhammer.plugin = async (instance) => {
  instance.set('role', roles)
}

export const role = plugin(rolePlugin, {
  name: 'role',
  shouldSkipOverride: true,
})
