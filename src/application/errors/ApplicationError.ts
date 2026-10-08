/**
 * Error base de la capa de aplicación.
 *
 * A diferencia de los errores de dominio, estos describen fallos de
 * orquestación (por ejemplo, no encontrar un recurso solicitado).
 */
export class ApplicationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = new.target.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class TaskNotFoundError extends ApplicationError {
  constructor(id: string) {
    super(`Task with id "${id}" was not found`)
  }
}
