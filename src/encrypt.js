'use strict'

import crypto from 'crypto'

import _createTransformStream from './transform'

const encoding = 'base64'

function decrypt (key, buffer) {
  return (arguments.length > 1)
    ? decryptSegment(buffer)
    : decryptSegment

  function decryptSegment (segment) {
    try {
      const decipher = crypto.createDecipher('aes256', key) // eslint-disable-line
      return Buffer.from(decipher.update(segment.toString(), encoding) + decipher.final())
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

function encrypt (key, buffer) {
  return (arguments.length > 1)
    ? encryptSegment(buffer)
    : encryptSegment

  function encryptSegment (segment) {
    try {
      const cipher = crypto.createCipher('aes256', key) // eslint-disable-line
      return Buffer.from(cipher.update(segment, null, encoding) + cipher.final(encoding))
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

function createDecryptStream (key) {
  return _createTransformStream(decrypt(key))
}

function createEncryptStream (key) {
  return _createTransformStream(encrypt(key))
}

export {
  createDecryptStream,
  createEncryptStream,
  decrypt,
  encrypt
}
