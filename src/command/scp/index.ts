import { Branch } from './branch'
import { Search } from './search'
import { Rtag } from './rtag'
import { User } from './user'
import { Page } from './page'
import { Tag } from './tag'

const scp = [Search, Tag, Page, User, Rtag, Branch].map(C => {
  const command = new C()

  command.group = 'SCP'

  return command
})

export default scp
