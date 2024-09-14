import { copyFile } from 'fs/promises'
import { resolve } from 'path'

const source = resolve('package.json')
const destination = resolve('build/package.json')

await copyFile(source, destination)

