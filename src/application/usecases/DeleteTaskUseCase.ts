import type { ForDeletingTask } from '../ports/in/ForManagingTasks.js'
import type { ForPersistingTasks } from '../ports/out/ForPersistingTasks.js'
import { TaskId } from '../../domain/model/TaskId.js'

/** Caso de uso: eliminar una tarea. */
export class DeleteTaskUseCase implements ForDeletingTask {
  constructor(private readonly tasks: ForPersistingTasks) {}

  async execute(id: string): Promise<void> {
    await this.tasks.delete(TaskId.create(id))
  }
}
