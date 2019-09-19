'use strict'

import _createReadStream from './readable'

const isClient = (typeof window !== 'undefined') || (typeof self !== 'undefined')

const fs = (isClient)
  ? null
  : eval("require('fs')") // eslint-disable-line

const streamsaver = (isClient)
  ? require('streamsaver')
  : null

function readFromFileSystem (file, startIndex, endIndex) {
  return (arguments.length > 1)
    ? readFileSystemSegment(startIndex, endIndex)
    : readFileSystemSegment

  async function readFileSystemSegment (startIndex, endIndex) {
    const blob = file.slice(startIndex, endIndex)
    return Buffer.from(await blob.arrayBuffer())
  }
}

const createReadStream = (isClient)
  ? (file, windowSize = 64 * 1024) => {
    let startIndex = 0
    return _createReadStream({
      async read () {
        if (startIndex > file.size) {
          return null
        }

        const endIndex = startIndex + windowSize
        const buffer = await readFromFileSystem(file, startIndex, endIndex)
        startIndex = endIndex

        if (buffer.byteLength === 0) {
          return null
        }

        return buffer
      }
    })
  }
  : fs.createReadStream.bind(fs)

const createWriteStream = (isClient)
  ? streamsaver.createWriteStream.bind(streamsaver)
  : fs.createWriteStream.bind(fs)

export {
  createReadStream,
  createWriteStream,
  readFromFileSystem
}
