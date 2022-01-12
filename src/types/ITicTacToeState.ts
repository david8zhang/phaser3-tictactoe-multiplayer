import { ArraySchema } from '@colyseus/schema'

export enum GameState {
  WaitingForPlayers,
  Playing,
  Finished,
}

export enum Cell {
  Empty,
  X,
  O,
}

export interface ITicTacToeState {
  gameState: GameState
  board: ArraySchema<number>
  activePlayer: number
  winningPlayer: number
  isTie: boolean
}

export default ITicTacToeState
