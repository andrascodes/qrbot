'use strict'

const test = require('tape')
const createSendMessage = require('./')

test(`sendMessage`, nest => {
  
  let onceCalled = false
  const eventEmitter = {
    once: () => {
      onceCalled = true
    }
  }
  const sendRequest = ({ method, endpoint, body }) => Promise.resolve({ method, endpoint, body })
  const sendMessage = createSendMessage(eventEmitter, sendRequest)

  nest.test(`sendMessage: calls sendRequest with the correct args (id)`, async assert => {
    
    const id = 1
    const message = {
      text: 'hello world'
    }
    const expected = {
      method: 'POST',
      endpoint: 'messages',
      body: {
        recipient: {
          id,
        },
        message,
        notification_type: 'REGULAR',
        tag: 'Tag'
      }
    }
    const actual = await sendMessage(id, message, { 
      onDelivery: () => {}, 
      onRead: () => {},
      notification_type: 'REGULAR',
      tag: 'Tag'
    })
    assert.deepEqual(actual, expected)
    assert.ok(onceCalled)
    assert.end()
  })
  
  nest.test(`sendMessage: calls sendRequest with the correct args (phone_number)`, async assert => {
    
    const id = 1
    const message = {
      text: 'hello world'
    }
    const expected = {
      method: 'POST',
      endpoint: 'messages',
      body: {
        recipient: {
          phone_number: id,
          name: {
            first_name: 'Hello',
            last_name: 'World'
          },
        },
        message
      }
    }
    const actual = await sendMessage(undefined, message, { 
      phone_number: id,
      first_name: 'Hello',
      last_name: 'World'
    })
    assert.deepEqual(actual, expected)
    assert.end()
  })

  nest.test(`sendMessage: returns a rejected Promise if no id or phone_number is given`, async assert => {
    
    const id = 1
    const message = {
      text: 'hello world'
    }
    try {
      const actual = await sendMessage(undefined, message, { 
        first_name: 'Hello',
        last_name: 'World'
      })
    }
    catch(error) {
      assert.ok(error.error)
      assert.end()
    }
  })
  
})