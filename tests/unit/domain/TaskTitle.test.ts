import { describe, expect, it } from 'vitest'

import { InvalidTaskTitleError } from '../../../src/domain/errors/DomainError.js'
import { TaskTitle } from '../../../src/domain/model/TaskTitle.js'

describe('TaskTitle (value object)', () => {
  it('recorta los espacios sobrantes', () => {
    expect(TaskTitle.create('  comprar pan  ').value).toBe('comprar pan')
  })

  it('rechaza títulos vacíos', () => {
    expect(() => TaskTitle.create('   ')).toThrow(InvalidTaskTitleError)
  })

  it('rechaza títulos demasiado largos', () => {
    expect(() => TaskTitle.create('a'.repeat(TaskTitle.MAX_LENGTH + 1))).toThrow(
      InvalidTaskTitleError,
    )
  })
})
