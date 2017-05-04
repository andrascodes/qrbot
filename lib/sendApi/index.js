'use strict'

const createSendRequest = require('./sendRequest')
const createSendMessage = require('./sendMessage')
const createSendText = require('./sendText')
const createSendAttachment = require('./sendAttachment')
const createMarkSeen = require('./markSeen')
const createSendTypingIndicators = require('./sendTypingIndicators')

const sendApi = (eventEmitter, fetch, accessToken) => {
  const sendRequest = createSendRequest(fetch, accessToken)
  const sendMessage = createSendMessage(eventEmitter, sendRequest)
  const sendText = createSendText(sendMessage)
  const sendAttachment = createSendAttachment(sendMessage)
  const markSeen = createMarkSeen(sendRequest)
  const sendTypingIndicators = createSendTypingIndicators(sendRequest)
  // const uploadAttachment
  // const sendBroadcast

  return {
    sendRequest,
    sendMessage,
    sendText,
    sendAttachment,
    markSeen,
    sendTypingIndicators
  }
}

module.exports = sendApi