import { Client } from 'hershel'
import * as d from 'discord.js'
import got from 'got'

import { permission } from './permission'
import { Command } from '../types'
import { assert } from './util'

/**
 * Source of regulars expressions that globally matches discord items
 */
export const pattern = {
  EVERYONE: d.MessageMentions.EVERYONE_PATTERN.source,
  CHANNEL: d.MessageMentions.CHANNELS_PATTERN.source,
  USER: d.MessageMentions.USERS_PATTERN.source,
  ROLE: d.MessageMentions.ROLES_PATTERN.source,
}

/**
 * Check if command can run on this channel
 * @param command command
 * @param type channel type
 */
export const checkChannel = (command: Command, type: string) =>
  command.channel.includes(type as Command.channel)

/**
 * Resolve user from discord mention
 * @param resolvable user mention to resolve
 * @param client client
 */
export const resolveUser = (resolvable: string, client: d.Client) => {
  const matches = resolvable.match(/^<@!?(\d+)>$/)

  if (!matches) throw new Error('Impossible de trouver un utilisateur mentionné')

  return client.users.get(matches[1])
}

/**
 * Resolve users from discord mention
 * @param resolvables users mention array to resolve
 * @param client client
 */
export const resolveUsers = (resolvables: string[], client: d.Client) =>
  resolvables.map((u) => resolveUser(u, client))

/**
 * Resolve member from discord mention
 * @param resolvable member mention to resolve
 * @param client client
 */
export const resolveMember = (resolvable: string, guild: d.Guild) => {
  const user = resolveUser(resolvable, guild.client)
  const member = guild.member(user)

  if (!member) throw new Error('Impossible de trouver un membre mentionné')

  return member
}

/**
 * Resolve member from discord mention
 * @param resolvables members mention to resolve
 * @param client client
 */
export const resolveMembers = (resolvables: string[], guild: d.Guild) =>
  resolvables.map((u) => resolveMember(u, guild))

/**
 * Create custom got instance for Discord status API
 */
export const statusAPI: typeof got =
  // @ts-ignore
  got.extend({
    url: 'https://srhpyqt94yxb.statuspage.io/api/v2',
    responseType: 'json',
  })

type ValidatorOptions = {
  target: d.GuildMember
  app: Client
}

/**
 * Validator class
 */
export class Validator {
  private target: d.GuildMember
  private bot: Client

  constructor(options: ValidatorOptions) {
    this.target = options.target
    this.bot = options.app
  }

  /**
   * Throw if user has already the requested role
   * @param user user
   * @param role role
   */
  public throwIfHasRole(role: string) {
    if (this.target.roles.has(role)) {
      throw new Error(`${this.target.toString()} a déjà le rôle demandé`)
    }

    return this
  }

  /**
   * Throw if user has not already the requested role
   * @param user user
   * @param role role
   */
  public throwIfHasNotRole(role: string) {
    if (!this.target.roles.has(role)) {
      throw new Error(`${this.target.toString()} n'a pas le rôle requis`)
    }

    return this
  }

  /**
   * Check if operation is permitted from the provided author
   * @param info information object
   */
  public checkAgainst(author: d.GuildMember) {
    const { target, bot } = this

    assert(
      target.user.id !== author.user.id,
      `Impossible d'effectuer cette action sur vous-même`
    )

    assert(
      target.user.id !== bot.user.id,
      `Impossible d'effectuer cette action sur le bot`
    )

    const perm = {
      target: permission({ member: target }).level,
      author: permission({ member: author }).level,
    }

    assert(perm.author > perm.target, `Vous n'avez pas l'accréditation suffisante`)
    assert(perm.target < 2, `Impossible d'effectuer cette action sur un staff`)

    return this
  }
}
