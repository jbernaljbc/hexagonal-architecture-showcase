import type { TaskView } from '../dto/TaskView.js'
import { toTaskView } from '../dto/toTaskView.js'
import type { ForListingTasks } from '../ports/in/ForManagingTasks.js'
import type { ForPersistingTasks } from '../ports/out/ForPersistingTasks.js'

/** Caso de uso: listar todas las tareas. */
export class ListTasksUseCase implements ForListingTasks {
  constructor(private readonly tasks: ForPersistingTasks) {}

  async execute(): Promise<TaskView[]> {
    const tasks = await this.tasks.findAll()

    return tasks.map(toTaskView)
  }
}
