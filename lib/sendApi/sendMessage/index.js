'use strict'

const sendMessage = (eventEmitter, sendRequest) => 
  (recipient, message, options) => {

  const createBody = (recipient, message, { 
      notificationType, 
      usePhoneNumber,
      name,
      onRead, 
      onDelivery,
    } = {}) => {

    const body = {
      recipient: {
        id: recipient
      },
      message,
    }

    if(notificationType) {
      body.notification_type = notificationType
    }

    if(usePhoneNumber) {
      body.recipient = {
        phone_number: recipient,
      }
      if(name && name.first_name && name.last_name) {
        body.recipient.name = name
      }
    }

    if(typeof onDelivery === 'function' && !usePhoneNumber) {
      eventEmitter.once('delivery', event => {
        if(event.participant === body.recipient.id) {
          onRead(event)
        }
      })
    }
    if(typeof onRead === 'function' && !usePhoneNumber) {
      eventEmitter.once('read', event => {
        if(event.participant === body.recipient.id) {
          onDelivery(event)
        }
      })
    }

    return body
  }

  if(message instanceof Array) {

    const sendMessages = message.map(msg => () => {
      const body = createBody(recipient, msg.message, msg.options)
      return sendRequest({
        method: 'POST',
        endpoint: 'messages',
        body,
      })
    })

    return sendMessages.reduce(
      (promise, func) => promise
        .then(
          resultArray => func()
            .then(
              result => resultArray.concat(result)
            )
        ), 
      Promise.resolve([])
    )
  }
  else {
    const body = createBody(recipient, message, options)
    return sendRequest({
      method: 'POST',
      endpoint: 'messages',
      body,
    })
  }
}

module.exports = sendMessage