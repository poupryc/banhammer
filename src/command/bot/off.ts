import { Banhammer, Command, Color } from '../../types'

export class Off extends Command {
  constructor() {
    super({
      name: 'off',
      hidden: true,
      accreditation: 1,
      channel: ['text']
    })
  }

  public async action({ createReply, app }: Banhammer.Context) {
    const reply = createReply()

    if (app.user.presence.status === 'dnd') {
      return reply
        .setColor(Color.GREY)
        .setDescription(`${app.user} est déjà désactivé`)
        .send()
    }

    await app.user.setPresence({ status: 'dnd' })

    reply
      .setColor(Color.GREEN)
      .setDescription(`${app.user} est désormais désactivé`)
      .send()
  }
}
