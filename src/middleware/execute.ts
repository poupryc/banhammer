import { argument as arg } from '@hershel/dispatcher'

import { Banhammer } from '../types'

/**
 * Argument check & execute command
 * @param context banhammer context
 * @param next next middleware
 */
export const execute: Banhammer.middleware = async (ctx, next) => {
  const { params, state } = ctx

  const { resolved } = state.dispatcher.command
  const { keys } = state.dispatcher[arg]

  keys.forEach(k => {
    if (typeof params[k.name] !== 'undefined') return
    if (!k.optional) {
      throw new Error(`Utilisation incorrecte de \`${resolved.name}\``)
    }
  })

  const { command } = state.dispatcher
  await command.resolved.action(ctx)

  next()
}
