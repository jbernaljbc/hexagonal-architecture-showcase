import type { TaskView } from '../../dto/TaskView.js'

/**
 * Puertos de ENTRADA (driving ports).
 *
 * Describen las operaciones que la aplicación ofrece al mundo exterior.
 * Cada adaptador de entrada (HTTP, CLI, ...) habla contra estos contratos,
 * de modo que su implementación concreta es intercambiable.
 */
export interface CreateTaskInput {
  title: string
}

export interface ForCreatingTasks {
  execute(input: CreateTaskInput): Promise<TaskView>
}

export interface ForListingTasks {
  execute(): Promise<TaskView[]>
}

export interface ForGettingTask {
  execute(id: string): Promise<TaskView>
}

export interface ForCompletingTask {
  execute(id: string): Promise<TaskView>
}

export interface ForDeletingTask {
  execute(id: string): Promise<void>
}

/**
 * Agregado con todos los casos de uso disponibles.
 *
 * Es lo que el *composition root* construye y entrega a los adaptadores.
 */
export interface TaskUseCases {
  createTask: ForCreatingTasks
  listTasks: ForListingTasks
  getTask: ForGettingTask
  completeTask: ForCompletingTask
  deleteTask: ForDeletingTask
}
