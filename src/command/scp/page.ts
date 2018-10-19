import { Scpper, Api } from 'scpper.js'

import { Banhammer, Command, Color } from '../../types/'
import * as helper from '../../helper/'

export class Page extends Command {
  constructor() {
    super({
      name: 'page',
      aliases: ['p', 'scp'],
      channel: ['text', 'dm'],
      argument: `:search+`,
      info: 'affiche les informations sur une page'
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
        limit: 1,
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

    const page = helper.extractPageInfo(pages[0])

    reply
      .addField('Vote', (page.rating <= 0 ? '' : '+') + page.rating, true)
      .setFooter(page.authors.join(', '))
      .setColor(Color.GREY)
      .setTitle(page.title)
      .setURL(page.url)
      .update()

    helper
      .getPage(page)
      .then(({ description, classification }) => {
        if (classification) reply.addField('Classe', classification, true)

        reply
          .setDescription(description ? description : 'Aucune description')
          .update()
      })
      .catch(() => {
        reply.setDescription(`L'analyse n'est pas disponible`).update()
      })
  }
}
