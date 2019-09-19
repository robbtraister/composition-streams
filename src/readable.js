'use strict'

/* global ReadableStream */

const isClient = (typeof window !== 'undefined') || (typeof self !== 'undefined')

const { Readable } = (isClient)
  ? {}
  : eval("require('stream')") // eslint-disable-line

function createNodeReadStream (config) {
  return new Readable({
    async read () {
      this.push(await config.read())
    }
  })
}

function createBrowserReadStream (config) {
  return new ReadableStream({
    async pull (controller) {
      const buffer = await config.read()
      if (buffer === null) {
        controller.close()
      } else {
        controller.enqueue(buffer)
      }
    }
  })
}

export default (isClient)
  ? createBrowserReadStream
  : createNodeReadStream
