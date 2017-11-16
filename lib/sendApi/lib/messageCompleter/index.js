'use strict'

const addQuickReplies = (message, { quick_replies } = {}) => {
  
  // quick_replies.length <= 11
  if(quick_replies) {
    // quick_reply example: only the following two format is allowed
    // "quick_replies":[
    //   {
    //     "content_type":"location",
    //   },
    //   {
    //     "content_type":"text",
    //     "title":"Text", (20 character limit)
    //     "payload":"TEXT", (1000 character limit)
    //     "image_url": "https://asd.com/asd.png" (24x24)
    //   }
    // ]
    return Object.assign({}, message, { quick_replies })
  }
  return message
}

const addMetadata = (message, { metadata } = {}) => {
  
  // Custom string that is delivered with an echoed message: message_echoes subscription
  if(metadata) {
    return Object.assign({}, message, { metadata })
  }
  return message
}

module.exports = {
  addQuickReplies,
  addMetadata
}