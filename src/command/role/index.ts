import { Member } from './member'
import { Int } from './int'

const role = [Int, Member].map(C => {
  const command = new C()

  command.group = 'role'

  return command
})

export default role
