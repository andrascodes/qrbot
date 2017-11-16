'use strict'

const { addQuickReplies, addMetadata } = require('../lib/messageCompleter')

// Constructs the correct message object with quick_replies and metadata
// Calls sendMessage with the message obj and all the options
const sendAttachment = (sendMessage) => (recipientId, type, url, options = {}) => {
  // type: audio, video, file, image

  const payload = {}
  // Attachment Reuse:
  // Upload an attachment first and then use the returned 'attachment_id' to send that attachment
  if(options.attachment_id) {
    payload.attachment_id = options.attachment_id
  }
  else {
    payload.url = url
  }

  const message = [{
    attachment: {
      type,
      payload,
    }
  }]
  .map(msg => addQuickReplies(msg, options))
  .map(msg => addMetadata(msg, options))
  .reduce((prev, msg) => msg)

  return sendMessage(recipientId, message, options)
}

module.exports = sendAttachment