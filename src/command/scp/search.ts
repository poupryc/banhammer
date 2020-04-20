import Meilisearch from 'meilisearch'
import * as helper from '../../helper/'
import { Banhammer, Color, Command } from '../../types/'

export class Search extends Command {
  constructor() {
    super({
      name: 'search',
      aliases: ['s'],
      channel: ['text', 'dm'],
      argument: `:search+`,
      info: 'effectue une recherche de page',
    })
  }

  public async action({ createReply, params, app }: Banhammer.Context) {
    const reply = createReply({ color: Color.GOLD })

    let { search } = params

    const meilisearch = app.get<Meilisearch>('meilisearch')
    const index = meilisearch.getIndex('pages')

    const result = await index.search(search, {
      limit: 9,
      attributesToRetrieve: ['title', 'slug', 'subtitle', 'username', 'tag'],
    })

    if (result.hits.length === 0) {
      return reply
        .setColor(Color.RED)
        .setDescription(`Aucun résultat pour "${search}".`)
    }

    const text = result.hits
      .map((item: any) => {
        let title = item.subtitle ? `${item.title} - ${item.subtitle}` : item.title
        let username = item.username ? item.username : 'Inconnu'

        return `[${title}](http://fondationscp.wikidot.com/${
          item.slug
        }) *par ${username}* ${helper.authorToEmoji(item.tag)}`
      })
      .join('\n')

    reply.setTitle(`Résultat pour "${search}"`).setDescription(text).send()
  }
}
