import { Client, Room } from 'colyseus.js'
import { Schema } from '@colyseus/schema'
import Phaser from 'phaser'
import { Message } from '../../types/messages'
import ITicTacToeState from '../../types/ITicTacToeState'

export default class Server {
  private client: Client
  private events: Phaser.Events.EventEmitter
  private room?: Room<ITicTacToeState & Schema>
  private _playerIndex = -1

  constructor() {
    this.client = new Client('ws://localhost:2567')
    this.events = new Phaser.Events.EventEmitter()
  }

  get playerIndex() {
    return this._playerIndex
  }

  async join() {
    this.room = await this.client.joinOrCreate<ITicTacToeState & Schema>('tic-tac-toe')

    this.room.onMessage(Message.PlayerIndex, (message: { playerIndex: number }) => {
      this._playerIndex = message.playerIndex
    })

    // Initial state change
    this.room.onStateChange.once((state) => {
      this.events.emit('once-state-changed', state)
    })

    this.room.state.board.onChange = (changes) => {
      this.events.emit('board-changed', this.room?.state.board)
    }

    this.room.state.onChange = (changes) => {
      changes.forEach((change) => {
        const { field, value } = change
        switch (field) {
          case 'activePlayer': {
            this.events.emit('player-turn-changed', value)
            break
          }
          case 'winningPlayer': {
            this.events.emit('player-win', value)
            break
          }
        }
      })
    }
  }

  makeSelection(index: number) {
    if (!this.room) {
      return
    }
    if (this.playerIndex !== this.room.state.activePlayer) {
      console.warn("not this player's turn!")
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

  onPlayerTurnChanged(cb: (playerIndex: number) => void, context?: any) {
    this.events.on('player-turn-changed', cb, context)
  }

  onPlayerWon(cb: (playerIndex: number) => void, context?: any) {
    this.events.on('player-win', cb, context)
  }
}
