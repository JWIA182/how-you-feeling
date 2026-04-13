// Simple PNG icon generator - zero dependencies
import { writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createHash } from 'crypto'
import { deflateSync } from 'zlib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
    }
  }
  return (c ^ 0xffffffff) >>> 0
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const crcBuf = Buffer.concat([typeBuf, Buffer.from(data)])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(crcBuf), 0)
  return Buffer.concat([len, typeBuf, Buffer.from(data), crc])
}

function createPNG(width, height, pixels) {
  // Build raw image data with filter bytes
  const raw = []
  for (let y = 0; y < height; y++) {
    raw.push(0) // filter: none
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      raw.push(pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3])
    }
  }
  const rawData = Buffer.from(raw)
  const compressed = deflateSync(rawData, { level: 9 })

  const chunks = []
  // PNG signature
  chunks.push(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0
  chunks.push(makeChunk('IHDR', ihdr))
  // IDAT
  chunks.push(makeChunk('IDAT', compressed))
  // IEND
  chunks.push(makeChunk('IEND', Buffer.alloc(0)))

  return Buffer.concat(chunks)
}

// Draw a simple "?" character
function drawQuestionMark(size) {
  const pixels = new Uint8Array(size * size * 4)
  pixels.fill(0)
  pixels.fill(255, 3) // alpha = 255 for all

  // Simple bitmap for "?"
  const bmp = [
    "  ****  ",
    " **  ** ",
    "      * ",
    "    **  ",
    "   **   ",
    "   **   ",
    "        ",
    "   **   ",
  ]

  const fontSize = Math.floor(size * 0.5)
  const ox = Math.floor((size - fontSize * 0.9) / 2)
  const oy = Math.floor((size - fontSize) / 2)
  const cw = fontSize / 8
  const ch = fontSize / 8

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (bmp[r][c] === '*') {
        const x0 = Math.floor(ox + c * cw)
        const y0 = Math.floor(oy + r * ch)
        for (let dy = 0; dy < ch && y0 + dy < size; dy++) {
          for (let dx = 0; dx < cw && x0 + dx < size; dx++) {
            const i = ((y0 + dy) * size + (x0 + dx)) * 4
            pixels[i] = 255
            pixels[i + 1] = 255
            pixels[i + 2] = 255
          }
        }
      }
    }
  }

  return pixels
}

function genIcon(size) {
  const png = createPNG(size, size, drawQuestionMark(size))
  writeFileSync(join(publicDir, `icon-${size}.png`), png)
  console.log(`icon-${size}.png`)
}

genIcon(192)
genIcon(512)
genIcon(32)

// Copy for apple-touch-icon and favicon
const icon192 = readFileSync(join(publicDir, 'icon-192.png'))
const icon32 = readFileSync(join(publicDir, 'icon-32.png'))

writeFileSync(join(publicDir, 'apple-touch-icon.png'), icon192)
writeFileSync(join(publicDir, 'favicon.ico'), icon32)

console.log('Done!')
