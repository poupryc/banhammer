import { Softban } from './softban'
import { Disable } from './disable'
import { Enable } from './enable'
import { Unmute } from './unmute'
import { Prune } from './prune'
import { Mute } from './mute'
import { Kick } from './kick'
import { Ban } from './ban'

const mod = [Enable, Disable, Kick, Mute, Ban, Softban, Unmute, Prune].map(C => {
  const command = new C()

  command.group = 'modération'

  return command
})

export default mod
