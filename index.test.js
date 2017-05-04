'use strict'

const test = require('tape')
const request = require('supertest')
const express = require('express')
const crypto = require('crypto')

const createBot = require('./')

test(`QRBot`, nest => {
  
  const calledFunc = {
    get: false,
    post: false,
    use: false,
  }
  const router = {
    get: () => {
      calledFunc.get = true
    },
    post: () => {
      calledFunc.post = true
    },
    use: () => {
      calledFunc.use = true
    }
  }
  nest.test(`QRBot should throw an error if config values are not set`, assert => {

    try{
      const bot = createBot(router, { appSecret: 'asd' })
      assert.fail()
      assert.end()
    }
    catch(error) {
      assert.equal(error.message, 'You need to specify the pageId, accessToken, verifyToken and appSecret')
      assert.end()
    }
    
  })

  nest.test(`QRBot should create an object`, assert => {

    try {
      const bot = createBot(router, { appSecret: 'asd', verifyToken: 'asd', pageId: 'asd', accessToken: 'asd' })
      assert.equal(typeof bot, 'object')
      assert.end()
    }
    catch(error) {
      assert.fail(error.message)
      assert.end()
    }
  })

  nest.test(`QRBot should call the get method of the router that is passed to it`, assert => {

    const bot = createBot(router, { appSecret: 'asd', verifyToken: 'asd', pageId: 'asd', accessToken: 'asd' })

    assert.ok(calledFunc.get)
    assert.end()
  })
  
  nest.test(`QRBot should call the post method of the router that is passed to it`, assert => {

    const bot = createBot(router, { appSecret: 'asd', verifyToken: 'asd', pageId: 'asd', accessToken: 'asd' })

    assert.ok(calledFunc.post)
    assert.end()
  })
  
})

test(`GET /bot/webhook`, nest => {

  const app = express()
  const botRouter = express.Router()

  const appSecret = 'asd'
  const verifyToken = 'asd'
  const pageId = 'asd'
  const accessToken = 'asd'
  const bot = createBot(botRouter, { appSecret, verifyToken, pageId, accessToken })

  app.use('/bot', bot.router)
  
  nest.test(`GET /bot/webhook - 403 Forbidden`, assert => {

    request(app)
    .get('/bot/webhook')
    .expect(403)
    .end((error, res) => {
      if(error) {
        assert.fail(error)
        return assert.end()
      }
    
      assert.pass()
      return assert.end()
    })
  })

  nest.test(`GET /bot/webhook - success`, assert => {

    // if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === verifyToken) {
    //   console.log('Validation Succeded.')
    //   res.status(200).send(req.query['hub.challenge']);
    // } 

    const challenge = 'dsa'
    request(app)
    .get(`/bot/webhook?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=${challenge}`)
    .expect(200)
    .end((error, res) => {
      if(error) {
        assert.fail(error)
        return assert.end()
      }
      
      assert.equal(res.text, challenge)
      return assert.end()
    })
  })

})

test(`POST /bot/webhook`, nest => {

  const app = express()
  const botRouter = express.Router()

  const appSecret = 'asd'
  const verifyToken = 'asd'
  const pageId = 'asd'
  const accessToken = 'asd'
  const bot = createBot(botRouter, { appSecret, verifyToken, pageId, accessToken })

  app.use('/bot', bot.router)

  nest.test(`POST /bot/webhook - Could not validate signature`, assert => {
    request(app)
    .post('/bot/webhook')
    .send({ hello: 'world' })
    .expect(400)
    .end((error, res) => {
      if(error) {
        assert.fail(error)
        return assert.end()
      }
    
      assert.deepEqual(res.body, { error: 'Could not validate signature' })
      return assert.end()
    })
  })
  
  nest.test(`POST /bot/webhook - Could not validate the request signature`, assert => {
    request(app)
    .post('/bot/webhook')
    .set('x-hub-signature', appSecret)
    .send({ hello: 'world' })
    .expect(403)
    .end((error, res) => {
      if(error) {
        assert.fail(error)
        return assert.end()
      }
    
      assert.deepEqual(res.body, { error: 'Could not validate the request signature' })
      return assert.end()
    })
  })
  
  nest.test(`POST /bot/webhook - success`, assert => {
    const hashedAppSecret = '97acb73f5e4ca37c9da0009a994136b46a18c6b0'

    request(app)
    .post('/bot/webhook')
    .set('x-hub-signature', `sha1=${hashedAppSecret}`)
    .send({ hello: 'world' })
    .expect(200)
    .end((error, res) => {
      if(error) {
        assert.fail(error)
        return assert.end()
      }
    
      assert.pass()
      return assert.end()
    })
  })

})