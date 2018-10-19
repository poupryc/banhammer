import { Banhammer, Command, Color } from '../../types/'
import * as helper from '../../helper'

export class Mute extends Command {
  constructor() {
    super({
      name: 'mute',
      aliases: ['goulag', 'hug'],
      accreditation: 2,
      argument: `:user(${helper.pattern.USER}) :reason*`,
      info: 'mute un utilisateur',
      guarded: true
    })
  }

  public async action({ createReply, params, message, app }: Banhammer.Context) {
    const reply = createReply()

    const role = app.get<Banhammer.roles>('role')
    const muted = role.get('muted')

    const target = helper.resolveMember(params.user, message.guild)
    const { member: author } = message

    new helper.Validator({ app, target }).checkAgainst(author).throwIfHasRole(muted)

    const input = params.reason ? params.reason : 'Aucune raison définie'
    const reason = `[MUTE] ${input} ${author.user.tag} -> ${target.user.tag}`

    await Promise.all([
      target.removeRole(role.get('member'), reason),
      target.addRole(muted, reason)
    ])

    reply
      .setColor(Color.GREEN)
      .setDescription(`${target} a été muté`)
      .send()
  }
}
