'use strict'

const test = require('tape')
const createUploadAttachment = require('./')

test(`uploadAttachment`, nest => {
  
  const sendRequest = ({ method, endpoint, body }) => Promise.resolve({ method, endpoint, body })
  const uploadAttachment = createUploadAttachment(sendRequest)

  nest.test(`uploadAttachment: calls sendRequest with the correct args (id)`, async assert => {
    
    const type = 'image'
    const url = 'https://asd.com/img.jpg'
    const expected = {
      method: 'POST',
      endpoint: 'message_attachments',
      body: {
        message: {
          attachment: {
            type,
            payload: {
              url,
              is_reusable: true
            }
          }
        }
      }
    }
    const actual = await uploadAttachment(type, url)
    assert.deepEqual(actual, expected)
    assert.end()
  })

})