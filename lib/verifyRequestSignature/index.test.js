'use strict'

const test = require('tape')
const createVerifyRequestSignature = require('./')

test(`verifyRequestSignature is a function`, assert => {
  const verifyRequestSignature = createVerifyRequestSignature()

  assert.equal(typeof verifyRequestSignature, 'function')
  assert.end()
})

test(`verifyRequestSignature throws an error if the req does not contain an x-hub-signature header`, assert => {

  const verifyRequestSignature = createVerifyRequestSignature()
  const req = {
    headers: {}
  }

  try {
    verifyRequestSignature(req)
  }
  catch(error) {
    assert.ok(error instanceof Error)
    assert.equal(error.message, 'Could not validate signature')
    assert.end()
  }

})

test(`verifyRequestSignature throws an error if the signature hash's key is not the app secret `, assert => {

  const crypto = {
    createHmac: () => ({
      update: () => ({
        digest: () => {
          return 'false'
        }
      })
    })
  }
  const verifyRequestSignature = createVerifyRequestSignature(crypto)
  
  const req = {
    headers: {
      "x-hub-signature": 'asd'
    }
  }
  try {
    verifyRequestSignature(req)
    assert.fail('Does not throw error.')
  }
  catch(error) {
    assert.ok(error instanceof Error)
    assert.equal(error.message, 'Could not validate the request signature')
    assert.end()
  }
  
})

test(`verifyRequestSignature verifies valid requests`, assert => {

  const crypto = {
    createHmac: () => ({
      update: () => ({
        digest: () => {
          return 'asd'
        }
      })
    })
  }
  const verifyRequestSignature = createVerifyRequestSignature(crypto)
  
  const req = {
    headers: {
      "x-hub-signature": 'sha1=asd'
    }
  }
  try {
    assert.equal(verifyRequestSignature(req), undefined)
    assert.end()
  }
  catch(error) {
    assert.comment(error)
    assert.fail('Throws error.')
    assert.end()
  }
  
})