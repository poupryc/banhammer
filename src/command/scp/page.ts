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
    const reply = createReply({ ...helper.embed, color: Color.GOLD })

    let { search } = params

    const meilisearch = app.get<Meilisearch>('meilisearch')
    const index = meilisearch.getIndex('pages')

    const result = await index.search(search, {
      limit: 1,
      attributesToRetrieve: [
        'title',
        'subtitle',
        'slug',
        'username',
        'preview',
        'vote',
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
    const username = item.username ? item.username : 'Inconnu'

    console.log(item.preview)

    reply
      .setTitle(title)
      .setURL(`http://fondationscp.wikidot.com/${item.slug}`)
      .setDescription(
        item.preview ? item.preview.normalize() : 'Aucun aperçu disponible'
      )
      .addField('Votes', `${item.vote > 0 ? '+' : ''}${item.vote}`)
      .setFooter(`par ${username}`)
      .send()
  }
}
