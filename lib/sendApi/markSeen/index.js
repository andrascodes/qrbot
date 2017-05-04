'use strict'

const markSeen = (sendRequest) => (recipient, { usePhoneNumber, name } = {}) => {
  
  const body = {
    recipient: {
      id: recipient,
    },
    sender_action: 'mark_seen'
  }

  if(usePhoneNumber) {
    body.recipient = {
      phone_number: recipient
    }
    if(name && name.first_name && name.last_name) {
      body.recipient.name = name
    }
  }

  return sendRequest({
    method: 'POST',
    endpoint: 'messages',
    body,
  })
}

module.exports = markSeen