'use strict'

import axios from 'axios'

import _createReadStream from './readable'

function readFromUrl (url, startBytes, endBytes) {
  return (arguments.length > 1)
    ? readUrlRange(startBytes, endBytes)
    : readUrlRange

  async function readUrlRange (startBytes, endBytes) {
    const headers = {
      // Range header is inclusive; subtract 1 to make API match file-system slice
      Range: `bytes=${startBytes}${endBytes == null ? '' : `-${endBytes - 1}`}`
    }
    const response = await axios.get(url, {
      headers,
      responseType: 'arraybuffer'
    })
    return Buffer.from(response.data)
  }
}

function createReadStream (url, windowSize = 4 * 1024) {
  let startIndex = 0

  return _createReadStream({
    async read () {
      const endIndex = startIndex + windowSize
      try {
        const buffer = await readFromUrl(url, startIndex, endIndex)
        startIndex = endIndex

        if (buffer.byteLength === 0) {
          return null
        }

        return buffer
      } catch (error) {
        if (error.response && error.response.status === 416) {
          return null
        } else {
          throw error
        }
      }
    }
  })
}

export {
  createReadStream,
  readFromUrl
}
