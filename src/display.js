'use strict'

import _createTransformStream from './transform'

function createDisplayStream (element) {
  return _createTransformStream({
    transform (chunk) {
      if (element) {
        element.innerText += chunk.toString()
      }
      return chunk
    }
  })
}

export default createDisplayStream
