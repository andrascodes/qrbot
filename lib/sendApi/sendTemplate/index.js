'use strict'

const { addQuickReplies, addMetadata } = require('../lib/messageCompleter')

// Constructs the correct message object with the template, quick_replies and metadata
// Calls sendMessage with the message obj and all the options
const sendTemplate = (sendMessage) => (recipientId, payload, options = {}) => {
  
  const message = [{
    attachment: {
      type: 'template',
      payload,
    }
  }]
  .map(msg => addQuickReplies(msg, options))
  .map(msg => addMetadata(msg, options))
  .reduce((prev, msg) => msg)

  return sendMessage(recipientId, message, options)
}

module.exports = sendTemplate