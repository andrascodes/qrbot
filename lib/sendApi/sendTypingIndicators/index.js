'use strict'

const sendTypingIndicators = (sendRequest) => (recipient, milliseconds, { usePhoneNumber, name } = {}) => {
  
  const typingOnBody = {
    recipient: {
      id: recipient,
    },
    sender_action: 'typing_on'
  }

  if(usePhoneNumber) {
    typingOnBody.recipient = {
      phone_number: recipient
    }
    if(name && name.first_name && name.last_name) {
      typingOnBody.recipient.name = name
    }
  }

  const typingOffBody = {
    recipient: typingOnBody.recipient,
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