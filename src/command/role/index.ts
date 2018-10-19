import { Unchrono } from './unchrono'
import { Member } from './member'
import { Chrono } from './chrono'
import { Int } from './int'

const role = [Chrono, Int, Unchrono, Member].map(C => {
  const command = new C()

  command.group = 'role'

  return command
})

export default role
