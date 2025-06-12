import type { FilterTransformer } from '../types'
import { isImageExtension } from '@uplora/formats'
import { FilterSerializerError } from '../errors/FilterSerializerError'

const format: FilterTransformer<'format'> = (value) => {
  if (!isImageExtension(value)) {
    throw new FilterSerializerError(`Invalid image format: ${value}`)
  }

  return value
}

export default format
