import { ArraySchema } from '@colyseus/schema'

export enum Cell {
  Empty,
  X,
  O,
}

export interface ITicTacToeState {
  board: ArraySchema<number>
  activePlayer: number
  winningPlayer: number
}

export default ITicTacToeState
