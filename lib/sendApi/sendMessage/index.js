'use strict'

// Construct the request body for sendRequest
const sendMessage = (eventEmitter, sendRequest) => 
  (recipientId, message, {
    onDelivery,
    onRead,
    notification_type,
    phone_number,
    first_name,
    last_name,
    tag
  } = {}) => {

  const body = {}

  // The recipient can be specified with a Page scoped ID or a phone_number
  if(recipientId) {
    body.recipient = {
      id: recipientId
    }
  }
  else if(phone_number) {
    body.recipient = {
      phone_number,
    }
    // first_name and last_name can be specified additionally to the phone_number
    // better chance to find the correct user
    if(first_name && last_name) {
      body.recipient.name = {
        first_name,
        last_name
      }
    }
  }
  else {
    return Promise.reject({
      error: {
        message: "Set either the id or the phone_number of the recipient"
      }
    })
  }

  // notification_type: can be 'REGULAR', 'SILENT_PUSH', 'NO_PUSH'
  if(notification_type) {
    body.notification_type = notification_type
  }

  // If the message is tagged correctly it can be sent outside of the 24 + 1 hour window
  // tag: can be 'SHIPPING_UPDATE', 'RESERVATION_UPDATE, 'ISSUE_RESOLUTION'
  if(tag) {
    body.tag = tag
  }

  // listen to the next 'delivery' event coming from the same user (recipientId)
  if(typeof onDelivery === 'function') {
    eventEmitter.once('delivery', event => {
      if(event.participant === recipientId) {
        onRead(event)
      }
    })
  }
  // listen to the next 'read' event coming from the same user (recipientId)
  if(typeof onRead === 'function') {
    eventEmitter.once('read', event => {
      if(event.participant === recipientId) {
        onDelivery(event)
      }
    })
  }

  body.message = message
  return sendRequest({
    method: 'POST',
    endpoint: 'messages',
    body,
  })
}

module.exports = sendMessage