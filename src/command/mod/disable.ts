import { Dispatcher } from '@hershel/dispatcher'

import { Banhammer, Command, Color } from '../../types/'

export class Disable extends Command {
  constructor() {
    super({
      name: 'disable',
      accreditation: 1,
      argument: ':command',
      info: 'désactive une commande',
      guarded: true
    })
  }

  public action({ createReply, params, app }: Banhammer.Context) {
    const reply = createReply()

    const { registry } = app.get<Dispatcher<Command>>('dispatcher')

    const command = registry.resolve(params.command)
    const { name } = command

    if (!command) {
      return reply
        .setColor(Color.GREY)
        .setDescription('Aucune commande détectée')
        .send()
    }

    if (command.guarded) {
      return reply
        .setColor(Color.RED)
        .setDescription(`\`${name}\` est marqué comme protégé`)
        .send()
    }

    if (command.disabled) {
      return reply
        .setColor(Color.GREY)
        .setDescription(`\`${name}\` est déjà désactivé`)
        .send()
    }

    command.disabled = true

    reply
      .setColor(Color.GREEN)
      .setDescription(`\`${name}\` est désormais désactivé`)
      .send()
  }
}
