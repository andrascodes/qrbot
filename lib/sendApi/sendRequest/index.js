'use strict'

// Make a POST request to the Graph API's messages endpoint with your access_token
// Response: JSON string containing identifiers for the message and its recipient
// Error example:
// {
//   "error": {
//     "message": "Invalid OAuth access token.",
//     "type": "OAuthException",
//     "code": 190,
//     "error_subcode": 1234567,
//     "fbtrace_id": "BLBz/WZt8dN"
//   }
// }

const sendRequest = (fetch, accessToken) => ({ method = 'POST', endpoint = 'messages', body }) => {
  return fetch(`https://graph.facebook.com/v2.6/me/${endpoint}?access_token=${accessToken}`, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(res => res.json())
  .then(res => {
    if(res.error) {
      return Promise.reject(res)
    }
    else {
      return res
    }
  })
}

module.exports = sendRequest