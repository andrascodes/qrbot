'use strict'

const sendText = (sendMessage) => (recipient, text, options) => {
  return sendMessage(recipient, { text }, options)
}

module.exports = sendText