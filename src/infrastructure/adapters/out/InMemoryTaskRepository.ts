import type { ForPersistingTasks } from '../../../application/ports/out/ForPersistingTasks.js'
import type { Task } from '../../../domain/model/Task.js'
import type { TaskId } from '../../../domain/model/TaskId.js'

/**
 * Adaptador de SALIDA en memoria.
 *
 * Implementa el puerto `ForPersistingTasks` usando un `Map`. Es ideal para
 * tests y para arrancar la aplicación sin infraestructura externa.
 */
export class InMemoryTaskRepository implements ForPersistingTasks {
  private readonly tasks = new Map<string, Task>()

  async save(task: Task): Promise<void> {
    this.tasks.set(task.id.toString(), task)
  }

  async findById(id: TaskId): Promise<Task | null> {
    return this.tasks.get(id.toString()) ?? null
  }

  async findAll(): Promise<Task[]> {
    return [...this.tasks.values()]
  }

  async delete(id: TaskId): Promise<void> {
    this.tasks.delete(id.toString())
  }
}
