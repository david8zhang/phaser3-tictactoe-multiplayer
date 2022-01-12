import { Room, Client } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Message } from '../types/messages'
import TicTacToeState from './TicTacToeState'
import PlayerSelectionCommand from './commands/PlayerSelectionCommands'
import { GameState } from '../types/ITicTacToeState'

export class TicTacToe extends Room<TicTacToeState> {
  private dispatcher = new Dispatcher(this)
  onCreate(options: any) {
    this.maxClients = 2
    this.setState(new TicTacToeState())
    this.onMessage(Message.PlayerSelection, (client, message) => {
      this.dispatcher.dispatch(new PlayerSelectionCommand(), {
        client,
        index: message.index,
      })
    })
  }
  onJoin(client: Client, options: any) {
    const idx = this.clients.findIndex((c) => c.sessionId == client.sessionId)
    client.send(Message.PlayerIndex, { playerIndex: idx })
    if (this.clients.length >= 2) {
      this.state.gameState = GameState.Playing
    }
  }
  onLeave(client: Client, connected: boolean) {}
  onDispose() {}
}
