import pathToRegexp from 'path-to-regexp'

import { Banhammer, Command } from '../../types'
import * as helper from '../../helper'

type PathToRegexpOption = pathToRegexp.ParseOptions & pathToRegexp.RegExpOptions

export class Help extends Command {
  constructor() {
    super({
      name: 'help',
      argument: ':command?',
      channel: ['text', 'dm'],
      info: 'aide sur les commandes disponibles',
      guarded: true
    })
  }

  public action({ message, createReply, app, state, params }: Banhammer.Context) {
    const reply = createReply()

    const dispatcher = app.get<Banhammer.dispatcher>('dispatcher')

    const { authorization } = state

    const search = params.command

    // @ts-ignore
    const { registry, options } = dispatcher

    const commands = ([...new Set(registry.commands.values())] as Command[])
      .filter(
        c =>
          // check if user have accreditation for the command
          authorization.level >= c.accreditation ||
          // ...or specific role bypass if in guild
          (message.guild
            ? message.member.roles.some(r => c.roles.includes(r.id))
            : false)
      )
      .filter(c => !c.hidden)
      .filter(c =>
        // check if command is supposed to run on this type of channel
        helper.checkChannel(c, message.channel.type)
      )

    if (search) {
      const name = search.toLowerCase()

      const command = commands.find(c => [...c.values()].includes(search))

      if (!command) return message.react('🤔')

      // @ts-ignore
      const usage = helper.extractUsage(command.argument, options.pathToRegexp)

      reply
        .setAuthor(`🔍 Aide pour ${command.name}`)
        .addField(`\`${command.name} ${usage}\``, helper.upperFirst(command.info))

      if (name !== command.name) reply.setTitle(`Alias de \`${command.name}\``)

      return reply.send()
    }

    const grouped = helper.groupBy(c => (c.group ? c.group : '...'), commands)

    reply.setTitle('🔍 Aide du Banhammer')

    for (let [key, value] of Object.entries(grouped)) {
      const help = value.map(c => {
        let msg = `\`${c.name}\` ${c.info}`
        if (c.disabled) msg = `~~${msg}~~`

        return msg
      })

      reply.addField(helper.upperFirst(key), help)
    }

    reply
      .addField('Aide', "Utilisez `help <commande>` pour plus d'information")
      .send()
  }
}
