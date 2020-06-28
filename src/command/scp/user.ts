import { Scpper, Api } from 'scpper.js'
import * as Discord from 'discord.js'

import { Banhammer, Command, Color } from '../../types/'
import * as helper from '../../helper'

export class User extends Command {
  constructor() {
    super({
      name: 'user',
      aliases: ['u'],
      channel: ['text', 'dm'],
      argument: `:search+`,
      info: `effectue une recherche d'utilisateur`,
    })
  }

  public async action({ createReply, params, app, message }: Banhammer.Context) {
    const reply = createReply({ ...helper.embed, color: Color.GOLD })

    const scpper = app.get<Scpper>('scpper')

    await reply.setDescription('Recherche en cours...').send()

    let { search } = params

    const first = search.split(' ')[0].toLowerCase().trim()

    let site = scpper.site

    if (first in Api.SiteInitial) {
      site = first as Api.site
      search = search.replace(site, '').trim()
    }

    const { data } = await scpper
      .findUsers(search, {
        limit: 1,
        site: site,
      })
      .catch((err) => {
        reply.response.delete()
        throw err
      })

    const { users } = data

    if (users.length === 0) {
      return reply.setDescription(`Aucun résultat pour "${search}"`).update()
    }

    const user = users[0]

    Object.entries(user.activity).forEach(([key, { totalRating: vote, pages }]) =>
      reply.addField(
        key.toUpperCase(),
        `**${pages}** page${pages === 1 ? 's' : ''} pour **${
          vote ? vote : '0'
        }** votes`,
        true
      )
    )

    const total = Object.values(user.activity)
      .map((v) => Number(v.totalRating ? v.totalRating : 0))
      .reduce((a, o) => a + o)

    reply
      .setColor(Color.GREY)
      .setAuthor(user.displayName)
      .addField('Vote', (total <= 0 ? '' : '+') + total)
      .setDescription('')
      .update()
  }
}
