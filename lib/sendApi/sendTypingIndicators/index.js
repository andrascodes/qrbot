'use strict'

// Turn the typing indicators on for a given time (max. 20 seconds, 20000 milliseconds)
// Construct the body of the request
// Call sendRequest with the body
const sendTypingIndicators = (sendRequest) => (recipientId, milliseconds) => {
  
  const typingOnBody = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_on'
  }

  const typingOffBody = {
    recipient: {
      id: recipientId
    },
    sender_action: 'typing_off'
  }

  let timeout = 0
  if(isNaN(milliseconds)) {
    return Promise.reject(new Error(`The milliseconds duration value must be a number`))
  }
  else if(milliseconds < 0 || milliseconds > 20000) {
    return Promise.reject(new Error(`The milliseconds duration value must be between 0 and 20000`))
  }
  else {
    timeout = milliseconds
  }

  if(timeout === 0) {
    return Promise.resolve({
      result: `The typingIndicator ran for ${timeout} seconds`
    })
  }
  else {
    return sendRequest({
        method: 'POST',
        endpoint: 'messages',
        body: typingOnBody,
      })
      .then(() => setTimeoutPromise(timeout))
      .then(() => sendRequest({
        method: 'POST',
        endpoint: 'messages',
        body: typingOffBody
      }))
  }
}

// Promisified setTimeout helper function
const setTimeoutPromise = (milliseconds) => {
  return new Promise((resolve, reject) => {
    setTimeout((err, data) => {
      if(err) {
        reject(new Error('setTimeout has failed'))
      }
      resolve(true)
    }, milliseconds)
  })
}

module.exports = sendTypingIndicators