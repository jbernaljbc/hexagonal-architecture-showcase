import type { Task } from '../../../domain/model/Task.js'
import type { TaskId } from '../../../domain/model/TaskId.js'

/**
 * Puerto de SALIDA (driven port).
 *
 * Define lo que la aplicación necesita para persistir tareas. Los adaptadores
 * de persistencia son quienes implementan este contrato. Nótese que el puerto
 * depende del dominio, nunca al revés.
 */
export interface ForPersistingTasks {
  save(task: Task): Promise<void>
  findById(id: TaskId): Promise<Task | null>
  findAll(): Promise<Task[]>
  delete(id: TaskId): Promise<void>
}
