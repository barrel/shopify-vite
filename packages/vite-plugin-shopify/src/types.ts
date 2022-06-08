import type { InputOption } from 'rollup'

export type Entrypoints = Array<[string, string]>
export type Input = Exclude<InputOption, string | string[]>
