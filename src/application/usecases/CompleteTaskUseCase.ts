import { TaskNotFoundError } from '../errors/ApplicationError.js'
import type { TaskView } from '../dto/TaskView.js'
import { toTaskView } from '../dto/toTaskView.js'
import type { ForCompletingTask } from '../ports/in/ForManagingTasks.js'
import type { ForPersistingTasks } from '../ports/out/ForPersistingTasks.js'
import { TaskId } from '../../domain/model/TaskId.js'

/** Caso de uso: marcar una tarea como completada. */
export class CompleteTaskUseCase implements ForCompletingTask {
  constructor(private readonly tasks: ForPersistingTasks) {}

  async execute(id: string): Promise<TaskView> {
    const task = await this.tasks.findById(TaskId.create(id))

    if (task === null) {
      throw new TaskNotFoundError(id)
    }

    task.complete()
    await this.tasks.save(task)

    return toTaskView(task)
  }
}
