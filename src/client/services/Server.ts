import { Client, Room } from 'colyseus.js'
import { Schema } from '@colyseus/schema'
import Phaser from 'phaser'
import { Message } from '../../types/messages'
import ITicTacToeState from '../../types/ITicTacToeState'

export default class Server {
  private client: Client
  private events: Phaser.Events.EventEmitter
  private room?: Room<ITicTacToeState>

  constructor() {
    this.client = new Client('ws://localhost:2567')
    this.events = new Phaser.Events.EventEmitter()
  }

  async join() {
    this.room = await this.client.joinOrCreate<ITicTacToeState>('tic-tac-toe')

    // Initial state change
    this.room.onStateChange.once((state) => {
      this.events.emit('once-state-changed', state)
    })

    this.room.state.board.onChange = (changes) => {
      this.events.emit('board-changed', this.room?.state.board)
    }
  }

  makeSelection(index: number) {
    if (!this.room) {
      return
    }
    this.room.send(Message.PlayerSelection, { index })
  }

  onceStateChanged(cb: (state: ITicTacToeState) => void, context?: any) {
    this.events.once('once-state-changed', cb, context)
  }

  onBoardChanged(cb: (board: number[]) => void, context?: any) {
    this.events.on('board-changed', cb, context)
  }
}
