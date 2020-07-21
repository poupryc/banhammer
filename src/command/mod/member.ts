import { Banhammer, Command, Color } from '../../types/'
import * as helper from '../../helper'

export class Member extends Command {
  constructor() {
    super({
      name: 'member',
      accreditation: 2,
      argument: `:user(${helper.pattern.USER})`,
      info: 'donne le role member à un utilisateur',
    })
  }

  public async action({ createReply, params, message, app }: Banhammer.Context) {
    const reply = createReply()

    const roles = app.get<Banhammer.roles>('role')
    const member = roles.get('member')

    const target = helper.resolveMember(params.user, message.guild)
    const { member: author } = message

    new helper.Validator({ app, target }).checkAgainst(author).throwIfHasRole(member)

    const reason = `[MEMBER] ${author.user.tag} -> ${target.user.tag}`

    target.addRole(member, reason)

    reply
      .setColor(Color.GREEN)
      .setDescription(`${target} est désormais membre`)
      .send()
  }
}
