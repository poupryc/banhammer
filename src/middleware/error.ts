import { Banhammer, Color } from '../types'

/**
 * Handle error inside middleware
 * @param context banhammer context
 * @param next next middleware
 */
export const error: Banhammer.middleware = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    const { createReply, logger, id } = ctx

    logger.error({ err })

    if (!shouldSendError(err)) return

    const reply = createReply()
    const description = err.message
      ? err.message
      : 'Une erreur inconnue est survenue'

    reply.setColor(Color.RED).setDescription(description)
    if (process.env.NODE_ENV === 'dev') reply.setFooter(`Error ID :: ${id}`)

    return reply.send()
  }
}

/**
 * Test if error should be send by the bot
 * @param error error to test
 */
const shouldSendError = (error: Error = new Error()) =>
  error.message && !/^\[silent\]/.test(error.message)
