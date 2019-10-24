import { plugin } from '@hershel/plugin'
import { Scpper, Api } from 'scpper.js'

import { Banhammer } from '../types'

/**
 * Scpper injection plugin
 * @param instance banhammer
 */
const scpperPlugin: Banhammer.plugin = async instance => {
  const scpper = new Scpper({ site: 'fr', timeout: 10000 })

  instance.set('wiki', Api.SiteUrl[scpper.site])
  instance.set('scpper', scpper)
}

export const scpper = plugin(scpperPlugin, {
  name: 'scpper',
  shouldSkipOverride: true,
  hershel: 
})
