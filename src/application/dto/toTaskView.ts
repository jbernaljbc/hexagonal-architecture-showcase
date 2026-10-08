import type { Task } from '../../domain/model/Task.js'

import type { TaskView } from './TaskView.js'

/** Convierte una entidad de dominio en su representación de salida. */
export function toTaskView(task: Task): TaskView {
  const primitives = task.toPrimitives()

  return {
    id: primitives.id,
    title: primitives.title,
    status: primitives.status,
    createdAt: primitives.createdAt,
    updatedAt: primitives.updatedAt,
  }
}
