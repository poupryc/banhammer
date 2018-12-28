import { Banhammer, Command, Color } from '../../types/'
import * as helper from '../../helper'

export class Int extends Command {
  constructor() {
    super({
      name: 'int',
      accreditation: 2,
      argument: `:user(${helper.pattern.USER})`,
      info: 'donne le role membre à un utilisateur',
      guarded: true
    })
  }

  public async action({ createReply, params, message, app }: Banhammer.Context) {
    const reply = createReply()

    const role = app.get<Banhammer.roles>('role')

    const member = role.get('member')
    const int = role.get('int')

    const target = helper.resolveMember(params.user, message.guild)
    const { member: author } = message

    new helper.Validator({ app, target }).throwIfHasRole(int)

    const reason = `[INT] ${author.user.tag} -> ${target.user.tag}`

    await Promise.all([
      target.addRole(int, reason),
      target.removeRole(member, reason)
    ])

    reply
      .setColor(Color.GREEN)
      .setDescription(`${target} est désormais membre international`)
      .send()
  }
}
