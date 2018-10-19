import { Banhammer, Command, Color } from '../../types/'
import * as helper from '../../helper'

export class Unchrono extends Command {
  constructor() {
    super({
      name: 'unchrono',
      accreditation: 1,
      argument: `:user(${helper.pattern.USER})?`,
      info: 'supprime le role Chrono Challenger',
      roles: ['417357401994559491']
    })
  }

  public async action({ createReply, params, message, app }: Banhammer.Context) {
    const reply = createReply()

    const chrono = app.get<Banhammer.roles>('role').get('chrono')

    const { member: author } = message

    if (params.user) {
      const target = helper.resolveMember(params.user, message.guild)

      new helper.Validator({ app, target }).throwIfHasNotRole(chrono)

      const reason = `[CHRONO] ${author.user.tag} -> ${target.user.tag}`

      await target.removeRole(chrono, reason)

      return reply
        .setColor(Color.GREEN)
        .setDescription(`${target} n'est plus un Chrono Challenger`)
        .send()
    }

    const chronoRole = message.guild.roles.find(v => v.id === chrono)

    if (chronoRole.members.size === 0) {
      return reply
        .setColor(Color.GREY)
        .setMessage(`Aucune action n'a été effectuée`)
        .send()
    }

    const list = chronoRole.members.array()

    list.forEach(m =>
      m.removeRole(chrono, `[UNCHRONO] ${author.user.tag} -> ${m.user.tag}`)
    )

    reply
      .setColor(Color.GREEN)
      .setDescription(
        `Le role Chrono Challenger a été enlevé à ${list
          .map(u => u.toString())
          .join(', ')}`
      )
      .send()
  }
}
