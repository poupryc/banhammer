import { Banhammer, Command, Color } from '../../types/'
import * as helper from '../../helper'

export class Chrono extends Command {
  constructor() {
    super({
      name: 'chrono',
      accreditation: 1,
      argument: `:user(${helper.pattern.USER})`,
      info: 'ajoute le role Chrono Challenger',
      roles: ['417357401994559491']
    })
  }

  public async action({ createReply, params, message, app }: Banhammer.Context) {
    const reply = createReply()

    const chrono = app.get<Banhammer.roles>('role').get('chrono')

    const target = helper.resolveMember(params.user, message.guild)
    const { member: author } = message

    new helper.Validator({ app, target }).throwIfHasRole(chrono)

    const reason = `[CHRONO] ${author.user.tag} -> ${target.user.tag}`

    await target.addRole(chrono, reason)

    reply
      .setColor(Color.GREEN)
      .setDescription(`${target} est désormais un Chrono Challenger`)
      .send()
  }
}
