import Meilisearch from 'meilisearch'
import * as helper from '../../helper/'
import { Banhammer, Color, Command } from '../../types/'

export class Page extends Command {
  constructor() {
    super({
      name: 'page',
      aliases: ['p', 'scp'],
      channel: ['text', 'dm'],
      argument: `:search+`,
      info: 'affiche les informations sur une page',
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
      limit: 1,
      attributesToRetrieve: [
        'title',
        'subtitle',
        'preview',
        'url',
        'author',
        'vote',
        'tag',
      ],
    })

    if (result.hits.length === 0) {
      return reply
        .setColor(Color.RED)
        .setDescription(`Aucun résultat pour "${search}".`)
        .send()
    }

    const item: any = result.hits[0]

    const title = item.subtitle ? `${item.title} - ${item.subtitle}` : item.title
    const username = item.author ?? 'Inconnu'

    reply
      .setTitle(title)
      .setURL(item.url)
      .setDescription(item.preview?.normalize() ?? 'Aucun aperçu disponible')
      .addField('Votes', `${item.vote > 0 ? '+' : ''}${item.vote}`)
      .setFooter(`par ${username} ${helper.authorToEmoji(item.tag)}`)
      .send()
  }
}
