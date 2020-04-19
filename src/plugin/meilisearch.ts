import { plugin } from '@hershel/plugin'
import Meilisearch from 'meilisearch'

import { Banhammer } from '../types'

/**
 * Meilisearch injection plugin
 * @param instance banhammer
 */
const meilisearchPlugin: Banhammer.plugin = async (instance) => {
  const client = new Meilisearch({
    host: process.env.MEILISEARCH_HOST,
  })

  instance.set('meilisearch', client)
}

export const meilisearch = plugin(meilisearchPlugin, {
  name: 'meilisearch',
  shouldSkipOverride: true,
})
