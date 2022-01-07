import { Room, Client } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Message } from '../types/messages'
import TicTacToeState from './TicTacToeState'
import PlayerSelectionCommand from './commands/PlayerSelectionCommands'

export class TicTacToe extends Room<TicTacToeState> {
  private dispatcher = new Dispatcher(this)
  onCreate(options: any) {
    this.setState(new TicTacToeState())
    this.onMessage(Message.PlayerSelection, (client, message) => {
      this.dispatcher.dispatch(new PlayerSelectionCommand(), {
        client,
        index: message.index,
      })
    })
  }
  onJoin(client: Client, options: any) {}
  onLeave(client: Client, connected: boolean) {}
  onDispose() {}
}
