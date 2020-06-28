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
    let index_name = helper.index_names['fr']

    const match = helper.specific_search.exec(search)
    if (match) {
      const { branch, query } = match.groups

      if (match.groups.branch in helper.index_names) {
        index_name = helper.index_names[branch]
        search = query
      }
    }

    const meilisearch = app.get<Meilisearch>('meilisearch')
    const index = meilisearch.getIndex(index_name)

    const result = await index.search(search, {
      limit: 9,
      attributesToRetrieve: ['title', 'url', 'subtitle', 'author', 'tag'],
    })

    if (result.hits.length === 0) {
      return reply
        .setColor(Color.RED)
        .setDescription(`Aucun résultat pour "${search}".`)
        .send()
    }

    const text = result.hits
      .map((item: any) => {
        let title = item.subtitle ? `${item.title} - ${item.subtitle}` : item.title
        let username = item.author ?? 'Inconnu'

        return `[${title}](${item.url}) *par ${username}* ${helper.authorToEmoji(
          item.tag
        )}`
      })
      .join('\n')

    reply.setTitle(`Résultat pour "${search}"`).setDescription(text).send()
  }
}
