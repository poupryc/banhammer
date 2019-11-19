import { plugin } from '@hershel/plugin'
import * as d from 'discord.js'

import { permission, resolveMember } from '../helper'
import { Banhammer } from '../types'

/**
 * Reaction event handler
 * @param reaction discord MessageReaction
 * @param user user
 */
async function reactionHandler(reaction: d.MessageReaction, author: d.User) {
  const { channel, guild } = reaction.message
  if (topicDisableHandler(channel)) return

  const member = await guild.fetchMember(author)
  const accred = permission({ author, member })
  if (accred.level >= 1) return

  if (reaction.message.reactions.size > 5) reaction.remove(author)
}

/**
 * Check if channel topic disable handler behavior
 * @param channel channel to check
 */
function topicDisableHandler(channel: d.Channel) {
  if (!(channel instanceof d.TextChannel)) return false
  if (!channel.topic) return false
  if (channel.topic.includes('no-reaction-handler')) return true

  return false
}

/**
 * Resaction handler
 * @param instance banhammer
 */
const reactionPlugin: Banhammer.plugin = async instance => {
  instance.on('messageReactionAdd', reactionHandler)
}

export const reaction = plugin(reactionPlugin, {
  name: 'réaction',
  shouldSkipOverride: true
})
