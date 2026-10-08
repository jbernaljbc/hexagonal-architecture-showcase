/**
 * DTO de salida de la capa de aplicación.
 *
 * Es un objeto plano (serializable) que los adaptadores de entrada pueden
 * devolver tal cual, sin exponer las entidades del dominio.
 */
export interface TaskView {
  id: string
  title: string
  status: string
  createdAt: string
  updatedAt: string
}
