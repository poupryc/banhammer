import { Status } from './status'
import { About } from './about'
import { Dump } from './dump'
import { Help } from './help'
import { Off } from './off'
import { On } from './on'

const bot = [About, Help, Status, Dump, On, Off].map(C => {
  const command = new C()

  command.group = 'bot'

  return command
})

export default bot
