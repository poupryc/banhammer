import { Dispatcher } from '@hershel/dispatcher'
import { plugin } from '@hershel/plugin'

import { channel, error, disabled, authorization, execute } from '../middleware'
import { Banhammer } from '../types'

import commands from '../command'

/**
 * Dispatcher plugin
 * @param instance banhammer
 */
const dispatcherPlugin: Banhammer.plugin = async instance => {
  const dispatcher = new Dispatcher({
    prefix: ['!', instance.user.toString(), `<@!${instance.user.id}>`]
  })

  // @ts-ignore
  instance.config.reply.footer.icon_url = instance.user.avatarURL

  for (let command of commands) {
    dispatcher.register(command)
  }

  dispatcher
    .use(error)
    .use(channel)
    .use(authorization)
    .use(disabled)
    .use(execute)

  instance.use(dispatcher.commands()).set('dispatcher', dispatcher)
}

export const dispatcher = plugin(dispatcherPlugin, {
  name: 'dispatcher',
  shouldSkipOverride: true
})
