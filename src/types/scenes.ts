import type Server from '../client/services/Server'

export interface IGameOverSceneData {
  winner?: boolean
  isTie?: boolean
  onRestart?: () => boolean
}

export interface IGameSceneData {
  server: Server
  onGameOver: (data: IGameOverSceneData) => void
}
