'use strict'

const sendRequest = (fetch, accessToken) => ({ method = 'POST', endpoint = 'messages', body }) => {
  return fetch(`https://graph.facebook.com/v2.6/me/${endpoint}?access_token=${accessToken}`, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(res => res.json())
}

module.exports = sendRequest