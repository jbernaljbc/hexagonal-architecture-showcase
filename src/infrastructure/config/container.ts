import type {
  TaskUseCases,
} from '../../application/ports/in/ForManagingTasks.js'
import type { ForPersistingTasks } from '../../application/ports/out/ForPersistingTasks.js'
import { CompleteTaskUseCase } from '../../application/usecases/CompleteTaskUseCase.js'
import { CreateTaskUseCase } from '../../application/usecases/CreateTaskUseCase.js'
import { DeleteTaskUseCase } from '../../application/usecases/DeleteTaskUseCase.js'
import { GetTaskUseCase } from '../../application/usecases/GetTaskUseCase.js'
import { ListTasksUseCase } from '../../application/usecases/ListTasksUseCase.js'
import { FileTaskRepository } from '../adapters/out/FileTaskRepository.js'
import { InMemoryTaskRepository } from '../adapters/out/InMemoryTaskRepository.js'

export type PersistenceDriver = 'memory' | 'file'

export interface ContainerOptions {
  persistence?: PersistenceDriver
  filePath?: string
}

export interface Container {
  repository: ForPersistingTasks
  useCases: TaskUseCases
}

/**
 * Composition root.
 *
 * Único lugar donde se eligen las implementaciones concretas de los puertos.
 * Aquí se "cablean" los adaptadores de salida con los casos de uso. Es el
 * punto que habría que tocar para cambiar de persistencia o de framework.
 */
export function buildContainer(options: ContainerOptions = {}): Container {
  const persistence =
    options.persistence ??
    (process.env.PERSISTENCE as PersistenceDriver | undefined) ??
    'memory'

  const filePath = options.filePath ?? process.env.TASKS_FILE ?? './data/tasks.json'

  const repository: ForPersistingTasks =
    persistence === 'file'
      ? new FileTaskRepository(filePath)
      : new InMemoryTaskRepository()

  const useCases: TaskUseCases = {
    createTask: new CreateTaskUseCase(repository),
    listTasks: new ListTasksUseCase(repository),
    getTask: new GetTaskUseCase(repository),
    completeTask: new CompleteTaskUseCase(repository),
    deleteTask: new DeleteTaskUseCase(repository),
  }

  return { repository, useCases }
}
