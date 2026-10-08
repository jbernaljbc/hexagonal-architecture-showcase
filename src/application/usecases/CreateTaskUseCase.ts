import type { TaskView } from '../dto/TaskView.js'
import { toTaskView } from '../dto/toTaskView.js'
import type {
  CreateTaskInput,
  ForCreatingTasks,
} from '../ports/in/ForManagingTasks.js'
import type { ForPersistingTasks } from '../ports/out/ForPersistingTasks.js'
import { Task } from '../../domain/model/Task.js'

/**
 * Caso de uso: crear una tarea.
 *
 * Orquesta el dominio (construir la entidad) y el puerto de salida
 * (persistirla). No sabe ni le importa cómo se persiste.
 */
export class CreateTaskUseCase implements ForCreatingTasks {
  constructor(private readonly tasks: ForPersistingTasks) {}

  async execute(input: CreateTaskInput): Promise<TaskView> {
    const task = Task.create({ title: input.title })
    await this.tasks.save(task)

    return toTaskView(task)
  }
}
