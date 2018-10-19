import { Dice } from './dice'

const scp = [Dice].map(C => {
  const command = new C()

  command.group = 'autres'

  return command
})

export default scp
