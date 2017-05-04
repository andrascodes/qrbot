'use strict'

const test = require('tape')
const createSendTypingIndicators = require('./')

test.only(`sendTypingIndicators`, nest => {

  nest.test(`sendTypingIndicators: resolves with typing_off body`, async assert => {
    
    const sendRequestArgs = []
    const sendRequest = (args) => {
      sendRequestArgs.push(args)
      return Promise.resolve(args)
    }
    const sendTypingIndicators = createSendTypingIndicators(sendRequest)

    const recipient = {
      id: 1
    }
    const expectedFirst = {
      method: 'POST',
      endpoint: 'messages',
      body: {
        recipient,
        sender_action: 'typing_on'
      }
    }
    const expectedLast = {
      method: 'POST',
      endpoint: 'messages',
      body: {
        recipient,
        sender_action: 'typing_off'
      }
    }
    const actual = await sendTypingIndicators(recipient.id, 10)
    assert.deepEqual(actual, expectedLast)
    assert.deepEqual(sendRequestArgs, [expectedFirst, expectedLast])
    assert.end()
  })
  
  nest.test(`sendTypingIndicators: rejects when milliseconds duration is not a number`, async assert => {
    
    const sendRequest = (args) => Promise.resolve(args)
    const sendTypingIndicators = createSendTypingIndicators(sendRequest)

    const recipient = {
      id: 1
    }
    try {
      await sendTypingIndicators(recipient.id, 'ten')
    }
    catch(error) {
      assert.pass()
      assert.end()
    }
  })
  
  nest.test(`sendTypingIndicators: rejects when milliseconds duration is less than 0`, async assert => {
    
    const sendRequest = (args) => Promise.resolve(args)
    const sendTypingIndicators = createSendTypingIndicators(sendRequest)

    const recipient = {
      id: 1
    }
    try {
      await sendTypingIndicators(recipient.id, -10)
    }
    catch(error) {
      assert.pass()
      assert.end()
    }
  })
  
  nest.test(`sendTypingIndicators: rejects when milliseconds duration is more than 20000`, async assert => {
    
    const sendRequest = (args) => Promise.resolve(args)
    const sendTypingIndicators = createSendTypingIndicators(sendRequest)

    const recipient = {
      id: 1
    }
    try {
      await sendTypingIndicators(recipient.id, 30000)
    }
    catch(error) {
      assert.pass()
      assert.end()
    }
  })

})