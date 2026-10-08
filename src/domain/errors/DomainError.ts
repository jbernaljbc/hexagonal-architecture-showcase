/**
 * Error base de la capa de dominio.
 *
 * Los errores de dominio representan la violación de una regla de negocio
 * y no dependen de ninguna tecnología concreta (HTTP, base de datos, etc.).
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = new.target.name
    // Mantiene el stack trace correcto al extender Error en TypeScript.
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class InvalidTaskIdError extends DomainError {}

export class InvalidTaskTitleError extends DomainError {}

export class TaskAlreadyCompletedError extends DomainError {}
