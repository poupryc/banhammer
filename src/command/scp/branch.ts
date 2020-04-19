import { Api } from 'scpper.js'

import { Banhammer, Command, Color } from '../../types/'
import { assert } from '../../helper'

import branch from '../../assets/branch.json'

export class Branch extends Command {
  constructor() {
    super({
      name: 'branch',
      aliases: ['b'],
      channel: ['text', 'dm'],
      argument: `:branch?`,
      info: 'cherche les informations liées à une branche',
    })
  }

  public async action({ createReply, params }: Banhammer.Context) {
    const reply = createReply()

    if (params.branch) {
      const initial = params.branch.toLowerCase().trim()

      // @ts-ignore
      const branch: any = select(initial)
      const url = Api.SiteUrl[initial as Api.site]

      if (branch.discord) reply.addField('Discord', branch.discord)

      return reply
        .setDescription(`La Fondation SCP en ${branch.language}`)
        .setTitle(branch.name)
        .setColor(Color.GREY)
        .setURL(url)
        .send()
    }

    const branches = Object.entries(branch).map(
      ([initial, data]) => `${initial.toUpperCase()} - En ${data.language}`
    )

    reply
      .setDescription(branches.join('\n'))
      .setTitle('Branches de la Fondation SCP')
      .setColor(Color.GREY)
      .send()
  }
}

type site = keyof typeof branch

/**
 * Select corresponding branch
 * @param initial branch initial
 * @return branch
 */
function select(initial: site) {
  assert(initial in Api.SiteInitial, `"${initial}" n'est pas reconnu comme branche`)

  return branch[initial]
}
