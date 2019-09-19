'use strict'

/* global ReadableStream, WritableStream */

const isClient = (typeof window !== 'undefined') || (typeof self !== 'undefined')

const { Transform } = (isClient)
  ? {}
  : eval("require('stream')") // eslint-disable-line

function createNodeTransformStream (config) {
  return new Transform({
    async transform (chunk, encoding, callback) {
      let buffer
      try {
        buffer = await config.transform(chunk)
      } catch (error) {
        return callback(error)
      }
      this.push(buffer)
      callback()
    },

    async flush (callback) {
      if (config.final) {
        let buffer
        try {
          buffer = await config.final()
        } catch (error) {
          return callback(error)
        }
        this.push(buffer)
      }
      callback()
    }
  })
}

function createBrowserTransformStream (config) {
  let _controller
  return {
    readable: new ReadableStream({
      start: async (controller) => {
        _controller = controller
        // config.start && await config.start()
      }
    }),
    writable: new WritableStream({
      write: async (chunk) => {
        const buffer = await config.transform(chunk)
        if (buffer === null) {
          _controller.close()
        } else {
          _controller.enqueue(buffer)
        }
      },
      close: async () => {
        if (config.final) {
          const buffer = await config.final()
          if (buffer !== null) {
            _controller.enqueue(buffer)
          }
        }
        _controller.close()
      }
    })
  }
}

export default (isClient)
  ? createBrowserTransformStream
  : createNodeTransformStream
