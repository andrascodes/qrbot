'use strict'

const crypto = require('crypto')
const bodyParser = require('body-parser')
const EventEmitter = require('events')
const _ = require('lodash')
const fetch = require('node-fetch')

const createVerifyRequestSignature = require('./lib/verifyRequestSignature')
const extractEvent = require('./lib/extractEvent')
const createSendApi = require('./lib/sendApi')

const createBot = (router, { appSecret, verifyToken, pageId, accessToken }) => {

  if(!appSecret || !verifyToken || !pageId || !accessToken) {
    throw new Error('You need to specify the pageId, accessToken, verifyToken and appSecret')
  }

  const eventEmitter = new EventEmitter()
  const { 
    sendRequest, 
    sendMessage,
    sendText, 
    sendAttachment,
    sendTemplate,
    markSeen,
    sendTypingIndicators,
    uploadAttachment
  } = createSendApi(eventEmitter, fetch, accessToken)

  const verifyRequestSignature = createVerifyRequestSignature(crypto, appSecret)
  router.use(bodyParser.json({ verify: verifyRequestSignature }))
  router.use((err, req, res, next) => {
    if(err.message === 'Could not validate signature') {
      return res.status(400).json({
        error: err.message
      })
    }
    else if(err.message === 'Could not validate the request signature') {
      return res.status(403).json({
        error: err.message
      })
    }
    else {
      next()
    }

  })

  router.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === verifyToken) {
      console.log('Validation Succeded.')
      res.status(200).send(req.query['hub.challenge'])
    } 
    else {
      console.error('Failed validation. Make sure the validation tokens match.')
      res.sendStatus(403)
    }
  })

  router.post('/webhook', (req, res) => {
    
    res.sendStatus(200)
    const { object, entry } = req.body
    if(object !== 'page' || !entry) {
      return;
    }

    const entries = _.flattenDeep(entry.map(e => e.messaging))
    const events = entries.map(e => extractEvent(e))
    
    events.forEach(event => {
      eventEmitter.emit('*', event)
      const { type, payload } = event
      if(type) {
        eventEmitter.emit(type, event)
      }
      if(type && payload) {
        eventEmitter.emit(`${type}:${payload}`, event)
      }
    })

  })

  const on = ({ type, payload }, callback) => {
    if(type && payload) {
      eventEmitter.on(`${type}:${payload}`, callback)
    }
    else if(type) {
      eventEmitter.on(`${type}`, callback)
    }
    else {
      throw new Error('You need to specify a type.')
    }
  }
 
  return {
    router,
    on,
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

module.exports = createBot