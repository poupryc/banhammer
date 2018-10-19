import { Scpper, Api } from 'scpper.js'

import { Banhammer, Command, Color } from '../../types/'
import * as helper from '../../helper/'

export class Search extends Command {
  constructor() {
    super({
      name: 'search',
      aliases: ['s'],
      channel: ['text', 'dm'],
      argument: `:search+`,
      info: 'effectue une recherche de page'
    })
  }

  public async action({ createReply, params, app }: Banhammer.Context) {
    const reply = createReply({ ...helper.embed, color: Color.GOLD })

    const scpper = app.get<Scpper>('scpper')

    await reply.setDescription('Recherche en cours...').send()

    let { search } = params

    const first = search
      .split(' ')[0]
      .toLowerCase()
      .trim()

    let site = scpper.site

    if (first in Api.SiteInitial) {
      site = first as Api.site
      search = search.replace(site, '').trim()
    }

    const { data } = await scpper
      .findPages(search, {
        limit: 6,
        site: site
      })
      .catch(err => {
        reply.response.delete()
        throw err
      })

    const { pages } = data

    if (pages.length === 0) {
      return reply.setDescription(`Aucun résultat pour "${search}"`).update()
    }

    const result = pages
      .map(helper.extractPageInfo)
      .map(i => `${i.link} - ${i.authors.join(', ')}`)
      .join('\n')

    reply
      .setColor(Color.GREY)
      .setTitle(`Résultat pour "${search}"`)
      .setDescription(result)
      .update()
  }
}
