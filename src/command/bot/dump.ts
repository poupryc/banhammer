import * as d from 'discord.js'
import * as h from 'hershel'
import * as fs from 'fs'

import pino from 'pino/package.json'

import { Banhammer, Command } from '../../types'

export class Dump extends Command {
  constructor() {
    super({
      name: 'dump',
      hidden: true,
      accreditation: 1,
      channel: ['text', 'dm'],
    })
  }

  public async action({ createReply, message, state, id }: Banhammer.Context) {
    const reply = createReply()

    const { author } = message
    const perm = state.authorization

    const docker = await isInsideMatrix()

    reply
      .setAuthor(author.tag, author.avatarURL)
      .addField('Discord.js', `v${d.version}`, true)
      .addField('Hershel', `v${h.version}`, true)
      .addField('Pino', `v${pino.version}`, true)
      .addField('Plateforme', `${process.platform} ${docker ? '🐋' : ''}`, true)
      .addField('Authorization', `Level ${perm.level} (${perm.type})`, true)
      .addField('NODE_ENV', `\`${process.env.NODE_ENV}\``, true)
      .setFooter(`Process ID - ${id}`)
      .send()
  }
}

/**
 * If we are inside docker matrix
 */
const isInsideMatrix = () =>
  new Promise<boolean>((r) =>
    fs.access('/.dockerenv', fs.constants.F_OK, (e) => r(!e))
  )
