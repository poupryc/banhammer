import { Banhammer, Command, Color } from '../../types/'
import * as helper from '../../helper'

export class Kick extends Command {
  constructor() {
    super({
      name: 'kick',
      accreditation: 4,
      argument: `:user(${helper.pattern.USER}) :reason*`,
      info: 'kick un utilisateur',
      guarded: true
    })
  }

  public async action({ createReply, params, message, app }: Banhammer.Context) {
    const reply = createReply({ color: Color.RED })

    const target = helper.resolveMember(params.user, message.guild)
    const { member: author } = message

    new helper.Validator({ app, target }).checkAgainst(author)

    if (!target.kickable) {
      return reply.setDescription(`L'utilisateur n'est pas kickable`).send()
    }

    const input = params.reason ? params.reason : 'Aucune raison définie'
    const reason = `[KICK] ${input} ${author.user.tag} -> ${target.user.tag}`

    await target.kick(reason)

    reply
      .setColor(Color.GREEN)
      .setDescription(`${target} a été kické`)
      .send()
  }
}
