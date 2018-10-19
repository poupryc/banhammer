import { permissionFromMessage } from '../helper/permission'
import { Banhammer } from '../types'

/**
 * Check authorization
 * @param context banhammer context
 * @param next next middleware
 */
export const authorization: Banhammer.middleware = ({ state, message }, next) => {
  const { resolved } = state.dispatcher.command
  if (!resolved) return

  const permission = permissionFromMessage(message)
  state.authorization = permission

  if (permission.level >= resolved.accreditation) return next()

  if (resolved.roles && message.member) {
    if (message.member.roles.some(r => resolved.roles.includes(r.id))) return next()
  }

  message.react('257292338894864384') // :ban:
  throw new Error('Accréditation insuffisante pour éxécuter cette commande')
}
