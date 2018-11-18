import { Banhammer, Command, Color } from '../../types'

export class On extends Command {
  constructor() {
    super({
      name: 'on',
      hidden: true,
      accreditation: 1,
      channel: ['text']
    })
  }

  public async action({ createReply, app }: Banhammer.Context) {
    const reply = createReply()

    if (app.user.presence.status === 'online') {
      return reply
        .setColor(Color.GREY)
        .setDescription(`${app.user} est déjà activé`)
        .send()
    }

    await app.user.setPresence({ status: 'online' })

    reply
      .setColor(Color.GREEN)
      .setDescription(`${app.user} est désormais activé`)
      .send()
  }
}
