import { Banhammer, Command, Color } from '../../types/'
import * as helper from '../../helper'

export class Prune extends Command {
  constructor() {
    super({
      name: 'prune',
      accreditation: 3,
      argument: `:user(${helper.pattern.USER}) :limit(\\d+)`,
      info: `supprime un nombre de message d'un utilisateur`
    })
  }

  public async action({ createReply, params, message, app }: Banhammer.Context) {
    const reply = createReply()

    const target = helper.resolveMember(params.user, message.guild)
    const { member: author } = message

    new helper.Validator({ app, target }).checkAgainst(author)

    const limit = Number(params.limit)

    if (!limit || limit < 1) {
      return reply
        .setColor(Color.RED)
        .setDescription(`La limite fournie n'est pas valide`)
        .send()
    } else {
      const messages = (await message.channel.fetchMessages({
        limit: 100,
        before: message.id
      }))
        .filter(a => a.author.id === target.id)
        .array()

      messages.length = Math.min(limit, messages.length)

      if (messages.length === 0) {
        return reply
          .setColor(Color.RED)
          .setDescription('Aucun message ne rentre dans la limite imposée')
          .send()
      }

      if (messages.length === 1) await messages[0].delete()
      else await message.channel.bulkDelete(messages)

      reply
        .setColor(Color.GREEN)
        .setDescription(
          `Supression de ${messages.length}
          message${messages.length > 1 ? 's' : ''} effectuée`
        )
        .send()
    }
  }
}
