import { Banhammer, Command, Color } from '../../types/'
import * as helper from '../../helper'

export class Ban extends Command {
  constructor() {
    super({
      name: 'ban',
      accreditation: 4,
      info: 'bannit un utilisateur',
      argument: `:user(${helper.pattern.USER}) :reason*`,
      guarded: true
    })
  }

  public async action({ createReply, params, message, app }: Banhammer.Context) {
    const reply = createReply()

    const target = helper.resolveMember(params.user, message.guild)
    const { member: author } = message

    new helper.Validator({ app, target }).checkAgainst(author)

    if (!target.bannable) {
      return reply.setDescription(`${target} n'est pas bannissable`).send()
    }

    const input = params.reason ? params.reason : 'Aucune raison définie'
    const reason = `[BAN] ${input} ${author.user.tag} -> ${target.user.tag}`

    await target.ban({ reason })

    reply
      .setColor(Color.GREEN)
      .setDescription(`${target} a été banni`)
      .send()
  }
}
