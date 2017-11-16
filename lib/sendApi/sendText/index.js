'use strict'

const { addQuickReplies, addMetadata } = require('../lib/messageCompleter')

// Constructs the correct message object with quick_replies and metadata
// Calls sendMessage with the message obj and all the options
const sendText = (sendMessage) => (recipientId, text, options = {}) => {

  // text: must be UTF-8 and length <= 640 chars
  const message = [{ text }]
                  .map(msg => addQuickReplies(msg, options))
                  .map(msg => addMetadata(msg, options))
                  .reduce((prev, msg) => msg)

  return sendMessage(recipientId, message, options)
}

module.exports = sendText