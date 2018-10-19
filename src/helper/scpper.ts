import { Api } from 'scpper.js'
import * as url from 'url'

export const extractPageInfo = (page: Api.PageItem) => ({
  ...page,
  authors: page.authors.map(formatAuthor),
  link: formatUrl(page),
  url: extractUrl(page)
})

/**
 * Format author object to string
 * @param author author object
 */
export const formatAuthor = (author: Api.AuthorField) =>
  `${author.user} ${determineRoleEmoji(author.role)}`

/**
 * Format URL
 * @param page page item
 */
export const formatUrl = (page: Api.PageItem) =>
  `[${page.title}](${extractUrl(page)})`

/**
 * Extract URL
 * @param page page item
 */
export const extractUrl = (page: Api.PageItem) => url.resolve(page.site, page.name)

/**
 * Transform role to emoji
 * @param role user role
 */
export const determineRoleEmoji = (role: string) => {
  switch (role) {
    case 'Author':
      return '✍️'
      break

    case 'Translator':
      return '🌐'
      break

    default:
      return `❓ (${role})`
      break
  }
}

/**
 * Scpper embed
 */
export const embed = {
  footer: { text: 'Propulsé par Scpper' }
}
