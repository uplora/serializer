import type { ImageExtension } from '@uplora/formats'

export interface Filters {
  format?: ImageExtension
  resize?: {
    width: number | undefined
    height: number | undefined
  }
}

export type FilterTransformer<F extends keyof Required<Filters>> = (value: string) => Filters[F]
