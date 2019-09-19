'use strict'

/* global WritableStream */

const isClient = (typeof window !== 'undefined') || (typeof self !== 'undefined')

const { Writable } = (isClient)
  ? {}
  : eval("require('stream')") // eslint-disable-line

function createNodeWriteStream (config) {
  return new Writable({
    async write (chunk, encoding, callback) {
      try {
        await config.write(chunk)
      } catch (error) {
        return callback(error)
      }
      callback()
    },
    async final (callback) {
      if (config.final) {
        try {
          await config.final()
        } catch (error) {
          return callback(error)
        }
      }
      callback()
    }
  })
}

function createBrowserWriteStream (config) {
  return new WritableStream({
    async write (chunk) {
      return config.write(chunk)
    },
    async close () {
      config.final && config.final()
    }
  })
}

export default (isClient)
  ? createBrowserWriteStream
  : createNodeWriteStream
