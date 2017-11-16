'use strict'

// Mark the last message as read
// Construct the body of the request
// Call sendRequest with the body
const markSeen = (sendRequest) => (recipientId) => {
  
  const body = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'mark_seen'
  }

  return sendRequest({
    method: 'POST',
    endpoint: 'messages',
    body,
  })
}

module.exports = markSeen