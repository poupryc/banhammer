import { checkChannel } from '../helper'
import { Banhammer } from '../types'

/**
 * Checks if the command is supposed to run on this type of channel
 * @param context banhammer context
 * @param next next middleware
 */
export const channel: Banhammer.middleware = ({ message, state }, next) => {
  const { resolved } = state.dispatcher.command
  const { type } = message.channel

  if (!resolved) return

  if (checkChannel(resolved, type)) return next()

  throw new Error('[silent] le channel est invalide pour la commande')
}
