import type { Filters, FilterTransformer } from './types'
import { FilterSerializerError } from './errors/FilterSerializerError'
import format from './transformers/format'
import resize from './transformers/resize'

const transformers: Record<keyof Filters, FilterTransformer<any>> = {
  format,
  resize,
}

export function serialize(filters: Filters): string {
  const stack = []

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined) {
      continue
    }

    if (key === 'resize') {
      if (!value.width && !value.height) {
        continue
      }

      stack.push(`${key}/${value.width || ''}x${value.height || ''}`)
      continue
    }

    stack.push(`${key}/${value}`)
  }

  return stack.length ? `-/${stack.join('/-/')}` : ''
}

export function unserialize(raw: string): Filters {
  const filters: Filters = {}

  if (!raw || raw === '') {
    return filters
  }

  const segments = raw.split('-')
  let emptySegments = 0

  for (const segment of segments) {
    if (!segment) {
      emptySegments++

      if (emptySegments > 1) {
        throw new FilterSerializerError('Invalid filter format')
      }

      continue
    }

    if (!segment.startsWith('/')) {
      throw new FilterSerializerError(`Invalid filter segment: ${segment}`)
    }

    if (segment.endsWith('//')) {
      throw new FilterSerializerError(`Invalid filter segment: ${segment}`)
    }

    const parts = segment.split('/').filter(Boolean)

    if (parts.length !== 2) {
      throw new FilterSerializerError(`Invalid filter format in segment: ${segment}`)
    }

    const filterType = parts[0] as keyof Filters
    const filterValue = parts[1] as string

    if (!transformers[filterType]) {
      throw new FilterSerializerError(`Invalid filter type: ${filterType}`)
    }

    filters[filterType] = transformers[filterType](filterValue)
  }

  return filters
}
