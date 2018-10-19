import { Dice as DiceGenerator } from 'dice-typescript'

import { Banhammer, Command } from '../../types/'
import { assert } from '../../helper'

const dice = new DiceGenerator(null, null, {
  maxRollTimes: 700
})

export class Dice extends Command {
  constructor() {
    super({
      name: 'dice',
      info: 'lance un ou plusieurs dés',
      argument: `:expression+`,
      channel: ['text', 'dm']
    })
  }

  public async action({ createReply, params, message }: Banhammer.Context) {
    const reply = createReply({ footer: null })

    const { author } = message
    reply.setAuthor(`${author.tag} 🎲`, author.avatarURL)

    const face = Number(params.expression)

    if (face) {
      assert(Number.isInteger(face), 'Le nombre donné doit être valide')
      assert(face < 700, 'Le nombre doit être inférieur à 700')
      assert(face > 0, 'Le nombre ne peut pas être 0 ou négatif')

      const result = dice.roll(`1d${face}`)
      return reply.setDescription(`Le résultat est ${result.total}`).send()
    }

    const result = dice.roll(params.expression)

    const isDiceLimitError = result.errors.some(e =>
      e.message.includes('Invalid number of rolls')
    )

    assert(isDiceLimitError === false, 'Le nombre de dés est limité à 700.')
    assert(
      result.errors.length === 0,
      `Erreur lors du lancé:
      ${result.errors.map(e => `\`${e.message}\``).join('\n')}`
    )

    const render =
      result.renderedExpression.length > 50
        ? 'Expression indisponible'
        : result.renderedExpression

    reply
      .setDescription(render)
      .addField('Total', result.total, true)
      .send()
  }
}
