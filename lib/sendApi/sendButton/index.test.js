'use strict'

const test = require('tape')
const createSendButton= require('./')

test(`sendButton`, nest => {

  const sendTemplate = (recipientId, payload, options) => Promise.resolve({recipientId, payload, options})
  const sendButton = createSendButton(sendTemplate)

  nest.test(`sendButton: calls sendMessage with correct args`, async assert => {
    const recipientId = 1
    const text = 'Button template text'
    const buttons = [
      {
        type: 'web_url',
        url: 'https://google.com',
        title: 'Google'
      }
    ]

    const options = {
      sharable: false
    }

    const expected = {
      recipientId,
      payload: {
        template_type: 'button',
        text,
        buttons,
        sharable: options.sharable
      },
      options
    }

    const actual = await sendButton(recipientId, text, buttons, options)
    assert.deepEqual(actual, expected)
    assert.end()
  })
})