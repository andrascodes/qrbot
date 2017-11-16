'use strict'

const uploadAttachment = (sendRequest) => (type, url) => {
  // type: image, audio, video, file

  const body = {
    message: {
      attachment: {
        type,
        payload: {
          url,
          is_reusable: true
        }
      }
    }
  }

  // Example response:
  // {
  //   "attachment_id":"1854626884821032"
  // }
  return sendRequest({
    method: 'POST',
    endpoint: 'message_attachments',
    body,
  })
}

module.exports = uploadAttachment