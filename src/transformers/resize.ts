import type { FilterTransformer } from '../types'
import { FilterSerializerError } from '../errors/FilterSerializerError'

const format: FilterTransformer<'resize'> = (value) => {
  if (value.includes('e')) {
    throw new FilterSerializerError(`Unsupported scientific notation: ${value}`)
  }

  let [width, height] = value.split('x').map(Number) as [number | undefined, number | undefined]

  if (Number.isNaN(width) || Number.isNaN(height)) {
    throw new FilterSerializerError(`Invalid resize value: ${value}`)
  }

  if (width === 0 && height === 0) {
    throw new FilterSerializerError(`Invalid zero resize value: ${value}`)
  }

  if (width === 0) {
    width = undefined
  }

  if (height === 0) {
    height = undefined
  }

  return { width, height }
}

export default format
