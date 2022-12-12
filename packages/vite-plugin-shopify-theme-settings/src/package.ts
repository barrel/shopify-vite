import fs from 'fs'
import { PackageManifest } from '@pnpm/types'

export const getPackage = (): PackageManifest => {
  return JSON.parse(fs.readFileSync('package.json', 'utf-8'))
}
