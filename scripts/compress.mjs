import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { brotliCompress, gzip } from 'node:zlib'
import { promisify } from 'node:util'

const brotli = promisify(brotliCompress)
const gzipFile = promisify(gzip)
const directory = 'dist/client/assets'
for (const name of await readdir(directory)) {
  if (!/\.(js|css)$/.test(name)) continue
  const path = join(directory, name)
  const input = await readFile(path)
  await Promise.all([
    brotli(input).then((data) => writeFile(path + '.br', data)),
    gzipFile(input).then((data) => writeFile(path + '.gz', data)),
  ])
}
