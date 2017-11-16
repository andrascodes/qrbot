'use strict'

// Constructs the correct button template payload object with the template, quick_replies and metadata
// Calls sendMessage with the button template payload obj and all the options
const sendButton = (sendTemplate) => (recipientId, text, buttons, options = {}) => {
  
  // buttons.length <= 3
  // sharable: (default: true), set to false to disable the native share button in Messenger

  const payload = {
    template_type: 'button',
    text,
    buttons,
    sharable: options.sharable
  }

  return sendTemplate(recipientId, payload, options)
}

module.exports = sendButton