'use strict'

import _createTransformStream from './transform'

function createLogStream () {
  return _createTransformStream({
    transform (chunk) {
      console.log(chunk.toString())
      return chunk
    }
  })
}

export default createLogStream
