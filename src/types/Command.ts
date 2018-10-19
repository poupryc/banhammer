import { Command as DCommand } from '@hershel/dispatcher'

declare namespace Command {
  type options = Partial<Options> & DCommand.Options

  type channel = 'dm' | 'group' | 'text'

  interface Options {
    accreditation: number
    channel: channel[]
    disabled: boolean
    guarded: boolean
    hidden: boolean
    roles: string[]
    group: string
    info: string
  }
}

abstract class Command extends DCommand {
  public readonly channel: Command.channel[] = ['text']
  public readonly accreditation: number = 0
  public readonly guarded: boolean = false
  public readonly hidden: boolean = false
  public readonly roles: string[] = []
  public group: string = 'bot'
  public disabled: boolean = false
  public readonly info: string

  constructor(options?: Command.options) {
    super(options)

    Object.assign(this, options)
  }
}

export { Command }
