import { Client } from 'hershel'

import * as middleware from './middleware'
import * as plugin from './plugin'

const isDev = process.env.NODE_ENV === 'dev'

const bot = new Client({
  logger: {
    level: isDev ? 'debug' : 'error'
  },
  reply: {
    footer: { text: 'Banhammer | Fondation SCP' }
  }
})

bot
  .use(middleware.error)
  .register(plugin.scpper)
  .register(plugin.role)
  .register(plugin.reaction)
  .register(plugin.dispatcher)

bot.login(process.env.DISCORD_TOKEN)

process.on('SIGINT', () => bot.destroy())
