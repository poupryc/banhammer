import { Banhammer } from '../types'

/**
 * Check if the command is disabled
 * @param context banhammer context
 * @param next next middleware
 */
export const disabled: Banhammer.middleware = ({ state }, next) => {
  const { resolved } = state.dispatcher.command
  const { authorization } = state

  if (!resolved.disabled) return next()
  if (authorization.level > 0) return next()

  throw new Error('La commande est désactivée')
}
