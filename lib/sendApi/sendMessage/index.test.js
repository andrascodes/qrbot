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
        message
      }
    }
    const actual = await sendMessage(id, message, { onDelivery: () => {}, onRead: () => {} })
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
    const actual = await sendMessage(id, message, { 
      usePhoneNumber: true,
      name: {
        first_name: 'Hello',
        last_name: 'World'
      },
    })
    assert.deepEqual(actual, expected)
    assert.end()
  })

  nest.test(`sendMessage: calls sendRequest with the correct args even when multiple messages are passed`, async assert => {
    
    const id = 1
    const messages = [
      {
        message: {
          text: "hello world"
        },
        options: {
          onDelivery: () => {},
          onRead: () => {},
          notificationType: 'SILENT_PUSH'
        }
      },
      {
        message: {
          attachment: {
            type: "audio",
            payload: {
              url: "https://petersapparel.com/bin/clip.mp3"
            }
          }
        },
        options: {
          onDelivery: () => {},
          onRead: () => {},
          notificationType: 'REGULAR'
        }
      }
    ]

    const expected = [
      {
        method: 'POST',
        endpoint: 'messages',
        body: { 
          recipient: { 
            id,
          },
          message: messages[0].message, 
          notification_type: messages[0].options.notificationType 
        }
      },
      {
        method: 'POST',
        endpoint: 'messages',
        body: { 
          recipient: { 
            id,
          },
          message: messages[1].message, 
          notification_type: messages[1].options.notificationType 
        }
      },
    ]
    const actual = await sendMessage(id, messages)
    assert.deepEqual(actual, expected)
    assert.end()
  })
  
})