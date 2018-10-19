import { Scpper } from 'scpper.js'

import { Banhammer, Command, Color } from '../../types/'
import * as helper from '../../helper/'

export class Tag extends Command {
  constructor() {
    super({
      name: 'tag',
      aliases: ['t'],
      channel: ['text', 'dm'],
      argument: `:search+`,
      info: 'effectue une recherche avec les tags spécifiés'
    })
  }

  public async action({ createReply, params, app }: Banhammer.Context) {
    const reply = createReply({ ...helper.embed, color: Color.GOLD })

    const scpper = app.get<Scpper>('scpper')

    await reply.setDescription('Recherche en cours...').send()

    let { search } = params

    const tags = search
      .trim()
      .split(' ')
      .map(tag => (/^(\+|-)/.test(tag) ? tag : `+${tag.trim()}`))

    const { data } = await scpper
      .findTag(tags, {
        limit: 7,
        random: true
      })
      .catch(err => {
        reply.response.delete()
        throw err
      })

    const { pages } = data

    if (pages.length === 0) {
      return reply
        .setDescription(`Aucun résultat pour "${tags.join(', ')}"`)
        .update()
    }

    const result = pages
      .map(helper.extractPageInfo)
      .map(i => `${i.link} - ${i.authors.join(', ')}`)
      .join('\n')

    reply
      .setColor(Color.GREY)
      .setTitle(`Résultat pour "${tags.join(', ')}"`)
      .setDescription(result)
      .update()
  }
}
