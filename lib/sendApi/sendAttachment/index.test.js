'use strict'

const test = require('tape')
const createSendAttachment = require('./')

test(`sendAttachment`, nest => {

  const sendMessage = (recipientId, message) => Promise.resolve({recipientId, message})
  const sendAttachment = createSendAttachment(sendMessage)

  nest.test(`sendAttachment: calls sendMessage with correct args`, async assert => {
    const recipientId = 1
    const type = 'audio'
    const url = 'https://site.com'
    const message = {
      attachment: {
        type,
        payload: {
          url
        }
      }
    }

    const expected = {
      recipientId,
      message
    }

    const actual = await sendAttachment(recipientId, type, url)
    assert.deepEqual(actual, expected)
    assert.end()
  })
})