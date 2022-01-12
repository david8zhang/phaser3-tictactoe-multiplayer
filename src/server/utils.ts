export const getValueAt = (board: number[], row: number, col: number) => {
  const idx = row * 3 + col
  return board[idx]
}
