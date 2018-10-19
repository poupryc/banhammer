import * as url from 'url'

import { Banhammer, Command, Color } from '../../types/'
import { upperFirst, assert } from '../../helper'

import tags from '../../assets/tags.json'

export class Rtag extends Command {
  constructor() {
    super({
      name: 'rtag',
      aliases: ['rt'],
      channel: ['text', 'dm'],
      argument: `:limit?`,
      info: 'tire le nombre de tag demandé compris entre 1 et 7'
    })
  }

  public async action({ createReply, params, app, message }: Banhammer.Context) {
    const reply = createReply()

    const wiki = app.get<string>('wiki')

    let limit = Number(params.limit)

    if (Number.isNaN(limit) && typeof params.limit !== 'undefined') {
      throw new Error('Un nombre est attendu')
    }

    limit = Math.round(limit)

    assert(
      limit <= 7 && limit > 0 && Number.isFinite(limit),
      'Le nombre doit être compris entre 1 et 7'
    )

    if (!limit) limit = Math.floor(Math.random() * 7) + 1

    const { author } = message
    reply.setAuthor(`${author.tag} 🏷️`, author.avatarURL)

    const tags = select(limit)

    const search = url.resolve(wiki, '/system:page-tags/tag/')
    const result = [...tags]
      .map(t => `[${upperFirst(t.tag)}](${url.resolve(search, t.tag)})`)
      .join('\n')

    const word = `tag${tags.size > 1 ? 's' : ''}`

    reply
      .setTitle(`Tirage de ${tags.size} ${word}`)
      .setColor(Color.GREY)
      .setDescription(result)
      .send()
  }
}

/**
 * Get a number of unique tags
 * @param limit
 * @return Set tags
 */
function select(limit: number) {
  /**
   * Get random tag
   * @return tag
   */
  const random = () => {
    const min = 0
    const max = tags.length - 1

    return tags[Math.floor(Math.random() * (max - min + 1) + min)]
  }

  const selection = new Set<ReturnType<typeof random>>()
  const seen: string[] = []

  while (selection.size !== limit) {
    const item = random()

    if (!item.type) {
      selection.add(item)
    } else if (!seen.includes(item.type)) {
      seen.push(item.type)
      selection.add(item)
    }
  }

  return selection
}
