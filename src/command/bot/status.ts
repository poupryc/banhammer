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
      aliases: ['ok']
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
      .addField('Discord', 'Récupération des informations...')

    await reply.send()

    const ping = reply.response.createdTimestamp - reply.message.createdTimestamp

    reply.fields[1].value = `${ping}ms`

    reply.update()

    // @ts-ignore
    const { body } = (await helper.statusAPI('incidents/unresolved.json')) as DStatus

    if (body.incidents.length === 0) {
      reply.fields[4].value = 'Aucun incident en cours'
      return reply.update()
    }

    const incidents = body.incidents.map(
      i => `🚨 ${i.name} - [${i.status}](${i.shortlink})`
    )

    reply.fields[4].value = incidents.join('\n')

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
