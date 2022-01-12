import { Command } from '@colyseus/command'
import ITicTacToeState, { Cell } from '../../types/ITicTacToeState'
import { getValueAt } from '../utils'
import NextTurnCommand from './NextTurnCommand'

export default class CheckTieCommand extends Command<ITicTacToeState> {
  determineTie() {
    for (let i = 0; i <= 2; i++) {
      for (let j = 0; j <= 2; j++) {
        if (getValueAt(this.state.board, i, j) === Cell.Empty) {
          return false
        }
      }
    }
    return true
  }
  execute() {
    const tie = this.determineTie()
    if (tie) {
      this.state.isTie = true
    } else {
      return [new NextTurnCommand()]
    }
  }
}
