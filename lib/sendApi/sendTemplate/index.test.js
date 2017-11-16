'use strict'

const test = require('tape')
const createSendTemplate= require('./')

test(`sendTemplate`, nest => {

  const sendMessage = (recipientId, message) => Promise.resolve({recipientId, message})
  const sendTemplate = createSendTemplate(sendMessage)

  nest.test(`sendTemplate: calls sendMessage with correct args`, async assert => {
    const recipientId = 1
    const payload = {
      text: 'Button template text',
      buttons: [
        {
          type: 'web_url',
          url: 'https://google.com',
          title: 'Google'
        }
      ]
    }

    const message = {
      attachment: {
        type: 'template',
        payload,
      },
      quick_replies: {
        content_type: 'location'
      },
      metadata: 'METADATA'
    }

    const expected = {
      recipientId,
      message
    }

    const actual = await sendTemplate(recipientId, payload, 
    {
      quick_replies: {
        content_type: 'location'
      },
      metadata: 'METADATA'
    })
    assert.deepEqual(actual, expected)
    assert.end()
  })
})