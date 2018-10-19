import { Dispatch, Dispatcher } from '@hershel/dispatcher'
import { Application } from 'hershel'
import compose from 'koa-compose'

import { Permission } from '../helper/permission'
import { Command } from './Command'
import { Roles } from '../plugin'

export namespace Banhammer {
  export type middleware = compose.Middleware<Context>
  export type plugin<O = any> = Application.Plugin<O>
  export type dispatcher = Dispatcher<Command>
  export type roles = Roles

  export interface Context extends Application.Context {
    state: State
    params: Record<string, string>
  }

  interface State {
    dispatcher: Dispatch.State<Command>
    authorization: Permission
  }
}
