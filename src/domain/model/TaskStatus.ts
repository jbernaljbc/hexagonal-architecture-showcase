/**
 * Estados posibles de una tarea.
 *
 * Se modela como unión de literales (en lugar de un `enum` de TypeScript)
 * para que el estado viaje como un simple string a través de los adaptadores.
 */
export const TaskStatus = {
  Pending: 'pending',
  Completed: 'completed',
} as const

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]
