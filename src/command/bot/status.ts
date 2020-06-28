import { registeredPlugins } from 'hershel/dist/lib'
import { Response } from 'got'

import { Banhammer, Command, Discord } from '../../types'
import * as helper from '../../helper'

type DStatus = Response<Discord.Incident>

export class Status extends Command {
  constructor() {
    super({
      name: 'status',
      info: 'statut du système',
      aliases: ['ok'],
      channel: ['dm', 'text'],
    })
  }

  public async action({ createReply, app }: Banhammer.Context) {
    const reply = createReply()

    const plugin = app[registeredPlugins]

    reply
      .setTitle('Statut du système')
      .addField('Ping vers Discord', format(app.ping), true)
      .addField('Ping du bot', 'En cours...', true)
      .addField('Uptime du système', format(process.uptime()), true)
      .addField('Plugin', plugin.join(', '), true)

    await reply.send()

    const ping = reply.response.createdTimestamp - reply.message.createdTimestamp

    reply.fields[1].value = `${ping}ms`

    reply.update()
  }
}

/**
 * Format seconds to HH:mm:ss
 * @param s seconds to format
 */
const format = (seconds: number) => {
  const pad = (s: number) => (s < 10 ? '0' : '') + s

  let h = Math.floor(seconds / (60 * 60))
  let m = Math.floor((seconds % (60 * 60)) / 60)
  let s = Math.floor(seconds % 60)

  return `${pad(h)}:${pad(m)}:${pad(s)}`
}
