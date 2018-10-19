import { Client } from 'hershel'

import { dispatcher, role, scpper } from './plugin'
import { error } from './middleware'

const isDev = process.env.NODE_ENV === 'dev'

const bot = new Client({
  logger: {
    level: isDev ? 'debug' : 'error'
  },
  reply: {
    footer: { text: 'Banhammer | Fondation SCP' }
  }
})

bot.use(error)

bot.register(scpper)
bot.register(role)
bot.register(dispatcher)

bot.login(process.env.DISCORD_TOKEN)

process.on('SIGINT', () => bot.destroy())
