'use strict'

const extractInformation = require('./extractInformation')

const extractEvent = (data) => {

  const participant = data.sender.id
  const { type, timestamp, payload } = extractInformation(data)

  return {
    participant,
    type,
    timestamp,
    payload,
    message: data,
  }
}

module.exports = extractEvent