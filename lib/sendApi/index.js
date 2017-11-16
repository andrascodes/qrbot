'use strict'

const createSendRequest = require('./sendRequest')
const createSendMessage = require('./sendMessage')
const createSendText = require('./sendText')
const createSendAttachment = require('./sendAttachment')
const createSendTemplate = require('./sendTemplate')

const createMarkSeen = require('./markSeen')
const createSendTypingIndicators = require('./sendTypingIndicators')
const createUploadAttachment = require('./uploadAttachment')

const sendApi = (eventEmitter, fetch, accessToken) => {
  const sendRequest = createSendRequest(fetch, accessToken)
  const sendMessage = createSendMessage(eventEmitter, sendRequest)
  const sendText = createSendText(sendMessage)
  const sendAttachment = createSendAttachment(sendMessage)
  const sendTemplate = createSendTemplate(sendMessage)

  const markSeen = createMarkSeen(sendRequest)
  const sendTypingIndicators = createSendTypingIndicators(sendRequest)
  const uploadAttachment = createUploadAttachment(sendRequest)
  // const sendBroadcast

  return {
    sendRequest,
    sendMessage,
    sendText,
    sendAttachment,
    sendTemplate,
    markSeen,
    sendTypingIndicators,
    uploadAttachment
  }
}

module.exports = sendApi