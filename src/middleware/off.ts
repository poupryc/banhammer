import { Banhammer } from '../types'

/**
 * Check if bot is disabled
 * @param context banhammer context
 * @param next next middleware
 */
export const off: Banhammer.middleware = ({ state, app }, next) => {
  const { authorization } = state

  if (app.user.presence.status !== 'dnd') return next()
  if (authorization.level >= 1) return next()

  throw new Error('[silent] le bot est désactivé')
}
