'use strict'

const test = require('tape')
const createSendRequest = require('./')

test(`sendRequest`, nest => {
  
  const fetch = (url, { headers, method, body }) => {
    return Promise.resolve({ json: () => {
      return Promise.resolve({
        url,
        headers,
        method,
        body
      })
    }})
  }
  
  nest.test(`sendRequest: calls fetch with the correct arguments`, async assert => {
    const accessToken = 'accessToken'
    const sendRequest = createSendRequest(fetch, accessToken)
    const body = { text: 'Hello World' }
    const expected = {
      body: JSON.stringify(body),
      url: `https://graph.facebook.com/v2.6/me/messages?access_token=${accessToken}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const actual = await sendRequest({ body })
    assert.deepEqual(actual, expected)
    assert.end()
  })
})