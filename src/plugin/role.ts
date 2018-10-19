import { plugin } from '@hershel/plugin'

import { Banhammer } from '../types'

export type Roles = Map<string, string>

const prod: Roles = new Map()
  .set('muted', '417334957279674368')
  .set('member', '417334522775076864')
  .set('chrono', '417357658597621762')
  .set('int', '417348223443664896')

const dev: Roles = new Map()
  .set('muted', '394955320298045440')
  .set('member', '394955194237976577')
  .set('chrono', '394955328028016673')
  .set('int', '394955325905567764')

/**
 * Roles for the banhammer
 */
export const roles = process.env.NODE_ENV === 'dev' ? dev : prod

/**
 * Roles injection plugin
 * @param instance banhammer
 */
const rolePlugin: Banhammer.plugin = async instance => {
  instance.set('role', roles)
}

export const role = plugin(rolePlugin, {
  name: 'role',
  shouldSkipOverride: true
})
