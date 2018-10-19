import { Banhammer, Command, Color } from '../../types/'
import * as helper from '../../helper'

export class Unmute extends Command {
  constructor() {
    super({
      name: 'unmute',
      accreditation: 2,
      argument: `:user(${helper.pattern.USER})`,
      info: 'démute un utilisateur',
      guarded: true
    })
  }

  public async action({ createReply, params, message, app }: Banhammer.Context) {
    const reply = createReply()

    const role = app.get<Banhammer.roles>('role')
    const muted = role.get('muted')

    const target = helper.resolveMember(params.user, message.guild)
    const { member: author } = message

    new helper.Validator({ app, target })
      .checkAgainst(author)
      .throwIfHasNotRole(muted)

    const reason = `[UNMUTE] ${author.user.tag} -> ${target.user.tag}`

    await target.removeRole(muted, reason)

    reply
      .setColor(Color.GREEN)
      .setDescription(`${target} a été démuté`)
      .send()
  }
}
