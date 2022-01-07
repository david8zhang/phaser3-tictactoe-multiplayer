import type Server from '../services/Server'
import Phaser from 'phaser'
import ITicTacToeState, { Cell } from '../../types/ITicTacToeState'

export default class Game extends Phaser.Scene {
  private server?: Server
  private cells: { display: Phaser.GameObjects.Rectangle; value: Cell }[] = []
  constructor() {
    super('game')
  }

  async create(data: { server: Server }) {
    const { server } = data
    this.server = server
    if (!this.server) {
      throw new Error('server instance missing')
    }

    await this.server.join()
    this.server.onceStateChanged(this.createBoard)
  }

  private createBoard = (state: ITicTacToeState) => {
    const { width, height } = this.scale
    const size = 128

    let x = width * 0.5 - size
    let y = height * 0.5 - size
    state.board.forEach((cellState, index) => {
      const cell = this.add
        .rectangle(x, y, size, size, 0xffffff)
        .setInteractive()
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
          this.server?.makeSelection(index)
        })
      this.cells.push({
        display: cell,
        value: cellState,
      })
      x += size + 5
      if ((index + 1) % 3 === 0) {
        y += size + 5
        x = width * 0.5 - size
      }
    })
    this.server?.onBoardChanged(this.handleBoardChanged, this)
  }

  private handleBoardChanged(board: Cell[]) {
    for (let i = 0; i < board.length; i++) {
      const cell = this.cells[i]
      if (cell.value !== board[i]) {
        this.add.star(cell.display.x, cell.display.y, 4, 4, 64, 0xff0000).setAngle(45)
      }
    }
  }
}
