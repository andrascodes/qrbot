'use strict'

const sendAttachment = (sendMessage) => (recipient, type, url, options) => {
  return sendMessage(recipient, {
    attachment: {
      type,
      payload: {
        url
      }
    }
  }, options)
}

module.exports = sendAttachment