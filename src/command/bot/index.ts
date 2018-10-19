import { Status } from './status'
import { About } from './about'
import { Dump } from './dump'
import { Help } from './help'

const bot = [About, Help, Status, Dump].map(C => {
  const command = new C()

  command.group = 'bot'

  return command
})

export default bot
