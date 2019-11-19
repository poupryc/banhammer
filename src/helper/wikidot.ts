import cheerio from 'cheerio'

// @ts-ignore
import WikidotKit from 'wikidot-kit'

import { assert } from './util'

const wk = new WikidotKit(process.env.WIKIDOT_TOKEN)

enum WikidotSite {
  'http://scp-wiki.wikidot.com' = 'scp-wiki',
  'http://fondationscp.wikidot.com' = 'fondationscp',
  'http://scp-int.wikidot.com' = 'scp-int'
}

/**
 * Get page informations
 * @param wiki wiki url
 * @param name page name
 */
export async function getPage({ site, name }: { site: string; name: string }) {
  const response = await wk.fetchPage(extractWiki(site), name)

  const document = cheerio.load(response.html)

  const parser = [extractClass, extractDescription, extractThreatLevel].map(p =>
    p(document)
  )

  const [classification, description, threat] = await Promise.all(parser)
  return { classification, description, threat }
}

/**
 * Extract class field
 * @param document document
 */
async function extractClass(document: CheerioStatic) {
  // @ts-ignore
  const element: CheerioElement = document('strong:contains("Class")')[0]
  if (!element) return null

  return element.next.data ? element.next.data.trim() : null
}

/**
 * Extract threat field
 * @param document document
 */
async function extractThreatLevel(document: CheerioStatic) {
  // @ts-ignore
  const element: CheerioElement = document('strong:contains("Niveau")')[0]
  if (!element) return null

  return element.next.data ? element.next.data.replace('o ', '').trim() : null
}

/**
 * Extract description field
 * @param document document
 */
async function extractDescription(document: CheerioStatic) {
  const preview = document('.preview > p').text()
  if (preview) return preview

  // @ts-ignore
  const element: CheerioElement = document('strong:contains("Description")')[0]
  if (!element) return

  const description = element.next.data.trim()
  if (!description) return null

  const sentences = description
    .substring(0, 350)
    .split(/(.*?[?!.])/g)
    .filter(Boolean)

  if (sentences.length === 0) return null

  return sentences.length !== 1
    ? sentences.slice(0, sentences.length - 1).join(' ')
    : sentences.join()
}

/**
 * Extract Wiki name from url
 * @param wiki wiki url
 */
function extractWiki(wiki: string) {
  assert(wiki in WikidotSite, `${wiki} n'est pas supporté`)

  // @ts-ignore
  return WikidotSite[wiki]
}
