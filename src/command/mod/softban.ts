import { Banhammer, Command, Color } from '../../types/'
import * as helper from '../../helper'

export class Softban extends Command {
  constructor() {
    super({
      name: 'softban',
      accreditation: 4,
      argument: `:user(${helper.pattern.USER}) :reason*`,
      info: `supprime les derniers messages sur 7 jours et kick l'utilisateur`,
      guarded: true
    })
  }

  public async action({ createReply, params, message, app }: Banhammer.Context) {
    const reply = createReply({ color: Color.RED })

    const target = helper.resolveMember(params.user, message.guild)
    const { member: author } = message

    new helper.Validator({ app, target }).checkAgainst(author)

    if (!target.bannable) {
      return reply.setDescription(`${target} n'est pas bannissable`).send()
    }

    const input = params.reason ? params.reason : 'Aucune raison définie'
    const reason = `[SOFTBAN] ${input} ${author.user.tag} -> ${target.user.tag}`

    await target.ban({ reason, days: 7 })
    await message.guild.unban(target, reason)

    reply
      .setColor(Color.GREEN)
      .setDescription(`Softban effectué sur ${target}`)
      .send()
  }
}
