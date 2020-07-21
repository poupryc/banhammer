import { Ban } from './ban'
import { Disable } from './disable'
import { Enable } from './enable'
import { Kick } from './kick'
import { Member } from './member'
import { Mute } from './mute'
import { Prune } from './prune'
import { Softban } from './softban'
import { Unmute } from './unmute'

const mod = [Enable, Disable, Kick, Mute, Ban, Softban, Unmute, Prune, Member].map(
  (C) => {
    const command = new C()

    command.group = 'modération'

    return command
  }
)

export default mod
