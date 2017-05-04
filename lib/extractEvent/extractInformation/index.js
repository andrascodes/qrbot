'use strict'

const extractInformation = (data) => {

  const message = data.message
  const timestamp = data.timestamp
  if(message) {
    // text, attach, quick_reply, echo
    if(message.is_echo) {
      return {
        type: 'echo',
        timestamp,
        payload: undefined
      }
    }
    else if(message.quick_reply) {
      return {
        type: 'quick_reply',
        timestamp,
        payload: message.quick_reply.payload,
      }
    }
    else if(message.text) {
      return {
        type: 'text',
        timestamp,
        payload: undefined
      }
    }
    else if(message.attachments && message.sticker_id) {
      return {
        type: 'sticker',
        timestamp,
        payload: message.sticker_id
      }
    }
    else if(message.attachments) {
      // audio, video, file, image, location, fallback (not supported by the Messenger Platform)
      const attachment = message.attachments[0]
      return {
        type: attachment.type,
        timestamp,
        payload: undefined
      }
    }
    else {
      return {
        type: undefined,
        timestamp,
        payload: undefined,
      }
    }
  }
  else if(data.delivery) {
    return {
      type: 'delivery',
      timestamp: data.delivery.watermark,
      payload: undefined,
    }
  }
  else if(data.read) {
    return {
      type: 'read',
      timestamp: data.read.watermark,
      payload: undefined,
    }
  }
  else if(data.optin) {
    return {
      type: 'optin',
      timestamp,
      payload: data.optin.ref,
    }
  }
  else if(data.referral) {
    return {
      type: 'referral_existing',
      timestamp,
      payload: data.referral.ref
    }
  }
  else if(data.postback && data.postback.referral) {
    return {
      type: 'referral_new',
      timestamp,
      payload: data.postback.referral.ref
    }
  }
  else if(data.postback) {
    return {
      type: 'postback',
      timestamp,
      payload: data.postback.payload
    }
  }
  else if(data.account_linking && data.account_linking.status === 'linked') {
    return {
      type: 'account_linked',
      timestamp,
      payload: undefined
    }
  }
  else if(data.account_linking && data.account_linking.status === 'unlinked') {
    return {
      type: 'account_unlinked',
      timestamp,
      payload: undefined
    }
  }
  else {
    return {
      type: undefined,
      timestamp,
      payload: undefined
    }
  }
}

module.exports = extractInformation