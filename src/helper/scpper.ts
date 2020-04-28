import { Api } from 'scpper.js'
import * as url from 'url'

export const extractPageInfo = (page: Api.PageItem) => ({
  ...page,
  authors: page.authors.map(formatAuthor),
  link: formatUrl(page),
  url: extractUrl(page),
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

export function authorToEmoji(tags: string[]) {
  const lang = [
    'cn',
    'de',
    'en',
    'es',
    'it',
    'jp',
    'ko',
    'pl',
    'pt',
    'ru',
    'th',
    'ua',
  ]

  const translation = lang.some((i) => tags.includes(i))

  return translation ? '🌍' : '✍️'
}

/**
 * Scpper embed
 */
export const embed = {
  footer: { text: 'Propulsé par Scpper' },
}

/**
 * Regex to search specific wiki
 */
export const specific_search = /^(?<branch>[a-zA-Z]{2,})\s+(?<query>.+)$/

/**
 * Map locale to Meilisearch index
 */
export const index_names: Record<string, string> = {
  en: 'page_en',
  fr: 'page_fr',
}
