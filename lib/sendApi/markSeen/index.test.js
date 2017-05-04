'use strict'

const test = require('tape')
const createMarkSeen = require('./')

test(`markSeen`, nest => {
  
  const sendRequest = ({ method, endpoint, body }) => Promise.resolve({ method, endpoint, body })
  const markSeen = createMarkSeen(sendRequest)

  nest.test(`markSeen: calls sendRequest with the correct args (id)`, async assert => {
    
    const id = 1
    const expected = {
      method: 'POST',
      endpoint: 'messages',
      body: {
        recipient: {
          id,
        },
        sender_action: 'mark_seen'
      }
    }
    const actual = await markSeen(id)
    assert.deepEqual(actual, expected)
    assert.end()
  })

  nest.test(`markSeen: calls sendRequest with the correct args (phone_number)`, async assert => {
    
    const id = 1
    const name = {
      first_name: 'Hello',
      last_name: 'World'
    }
    const expected = {
      method: 'POST',
      endpoint: 'messages',
      body: {
        recipient: {
          phone_number: id,
          name,
        },
        sender_action: 'mark_seen'
      }
    }
    const actual = await markSeen(id, { usePhoneNumber: true, name })
    assert.deepEqual(actual, expected)
    assert.end()
  })

})