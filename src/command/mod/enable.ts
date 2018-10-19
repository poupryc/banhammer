import { Dispatcher } from '@hershel/dispatcher'

import { Banhammer, Command, Color } from '../../types/'

export class Enable extends Command {
  constructor() {
    super({
      name: 'enable',
      accreditation: 1,
      argument: ':command',
      info: 'active une commande',
      guarded: true
    })
  }

  public action({ createReply, params, app }: Banhammer.Context) {
    const { registry } = app.get<Dispatcher<Command>>('dispatcher')
    const reply = createReply({ color: Color.RED })

    const command = registry.resolve(params.command)
    const { name } = command

    if (!command) return reply.setDescription('Aucune commande détectée').send()

    if (!command.disabled) {
      return reply
        .setColor(Color.GREY)
        .setDescription(`\`${name}\` est déjà activé`)
        .send()
    }

    if (command.guarded) {
      return reply.setDescription(`\`${name}\` est marquée comme protégé`).send()
    }

    command.disabled = false

    reply
      .setColor(Color.GREEN)
      .setDescription(`\`${name}\` est désormais activé`)
      .send()
  }
}
