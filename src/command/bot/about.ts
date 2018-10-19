import { Banhammer, Command, Color } from '../../types'
import pckg from '../../../package.json'

export class About extends Command {
  constructor() {
    super({
      name: 'about',
      aliases: ['i'],
      channel: ['text', 'dm'],
      info: 'a propos du bot',
      guarded: true
    })
  }

  public action({ createReply }: Banhammer.Context) {
    const reply = createReply({ color: Color.GREEN })

    const { description, version, repository, license } = pckg

    reply
      .setTitle('🛠️ A propos du Banhammer')
      .setDescription(description)
      .addField('Banhammer', `v${version}`, true)
      .addField('Node.js', process.version, true)
      .addField('License', license, true)
      .addField(
        'Participer au dévelopement',
        `Vous pouvez aider au dévelopement du bot !
        Retrouvez le projet sur [Github](${
          repository.url
        }) ainsi que [Hershel](https://github.com/hershel)`
      )
      .setFooter('Crée pour la Fondation SCP par HelloEdit 🎩')
      .send()
  }
}
