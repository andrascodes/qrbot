'use strict'

const test = require('tape')
const extractEvent = require('./')

test('extractEvent', nest => {
  
  const timestamp = 1

  nest.test(`extractEvent: returns an object `, assert => {
    assert.equal(typeof extractEvent({ sender: { id: 1 }}), 'object')
    assert.end()
  })
  
  nest.test(`extractEvent: returns the participant from the event `, assert => {
    const actual = extractEvent({ sender: { id: 1 }}).participant
    const expected = 1
    assert.equal(actual, expected)
    assert.end()
  })

  nest.test(`extractEvent: recognizes 'echo' messages`, assert => { 
    const data = {
      sender: {
        id: 1,
      },
      timestamp,
      message: {
        is_echo: true
      }
    }
    assert.equal(extractEvent(data).type, 'echo')
    assert.equal(extractEvent(data).timestamp, timestamp)
    assert.equal(extractEvent(data).payload, undefined)
    assert.end()
  })
  
  nest.test(`extractEvent: recognizes 'quick_reply' messages`, assert => { 
    const payload = 'PAYLOAD'
    const data = {
      sender: {
        id: 1,
      },
      timestamp,
      message: {
        quick_reply: {
          payload,
        }
      }
    }
    assert.equal(extractEvent(data).type, 'quick_reply')
    assert.equal(extractEvent(data).timestamp, timestamp)
    assert.equal(extractEvent(data).payload, payload)
    assert.end()
  })
  
  nest.test(`extractEvent: recognizes 'text' messages`, assert => { 
    const payload = 'hello world'
    const data = {
      sender: {
        id: 1,
      },
      timestamp,
      message: {
        text: payload
      }
    }
    assert.equal(extractEvent(data).type, 'text')
    assert.equal(extractEvent(data).timestamp, timestamp)
    assert.equal(extractEvent(data).payload, undefined)
    assert.end()
  })
  
  nest.test(`extractEvent: recognizes 'stickers'`, assert => { 
    const payload = 1
    const data = {
      sender: {
        id: 1,
      },
      timestamp,
      message: {
        sticker_id: payload,
        attachments: []
      }
    }
    assert.equal(extractEvent(data).type, 'sticker')
    assert.equal(extractEvent(data).timestamp, timestamp)
    assert.equal(extractEvent(data).payload, payload)
    assert.end()
  })
  
  nest.test(`extractEvent: recognizes 'attachments'`, assert => { 
    const data = {
      sender: {
        id: 1,
      },
      timestamp,
      message: {
        attachments: [
          {
            type: 'video'
          }
        ]
      }
    }
    assert.equal(extractEvent(data).type, 'video')
    assert.equal(extractEvent(data).timestamp, timestamp)
    assert.equal(extractEvent(data).payload, undefined)
    assert.end()
  })
  
  nest.test(`extractEvent: recognizes 'delivery' notes`, assert => { 
    const data = {
      sender: {
        id: 1,
      },
      delivery: {
        watermark: timestamp
      }
    }
    assert.equal(extractEvent(data).type, 'delivery')
    assert.equal(extractEvent(data).timestamp, timestamp)
    assert.equal(extractEvent(data).payload, undefined)
    assert.end()
  })
  
  nest.test(`extractEvent: recognizes 'read' notes`, assert => { 
    const data = {
      sender: {
        id: 1,
      },
      read: {
        watermark: timestamp
      }
    }
    assert.equal(extractEvent(data).type, 'read')
    assert.equal(extractEvent(data).timestamp, timestamp)
    assert.equal(extractEvent(data).payload, undefined)
    assert.end()
  })
  
  nest.test(`extractEvent: recognizes 'optin' notes`, assert => { 
    const payload = 'PAYLOAD'
    const data = {
      sender: {
        id: 1,
      },
      timestamp,
      optin: {
        ref: payload
      }
    }
    assert.equal(extractEvent(data).type, 'optin')
    assert.equal(extractEvent(data).timestamp, timestamp)
    assert.equal(extractEvent(data).payload, payload)
    assert.end()
  })
  
  nest.test(`extractEvent: recognizes 'referral' notes for existing users`, assert => { 
    const payload = 'PAYLOAD'
    const data = {
      sender: {
        id: 1,
      },
      timestamp,
      referral: {
        ref: payload
      }
    }
    assert.equal(extractEvent(data).type, 'referral_existing')
    assert.equal(extractEvent(data).timestamp, timestamp)
    assert.equal(extractEvent(data).payload, payload)
    assert.end()
  })
  
  nest.test(`extractEvent: recognizes 'referral' notes for new users`, assert => { 
    const payload = 'PAYLOAD'
    const data = {
      sender: {
        id: 1,
      },
      timestamp,
      postback: {
        referral: {
          ref: payload
        }
      }
    }
    assert.equal(extractEvent(data).type, 'referral_new')
    assert.equal(extractEvent(data).timestamp, timestamp)
    assert.equal(extractEvent(data).payload, payload)
    assert.end()
  })
  
  nest.test(`extractEvent: recognizes 'postback' notes`, assert => { 
    const payload = 'PAYLOAD'
    const data = {
      sender: {
        id: 1,
      },
      timestamp,
      postback: {
        payload,
      }
    }
    assert.equal(extractEvent(data).type, 'postback')
    assert.equal(extractEvent(data).timestamp, timestamp)
    assert.equal(extractEvent(data).payload, payload)
    assert.end()
  })
  
  nest.test(`extractEvent: recognizes 'account_linked' events`, assert => { 
    const data = {
      sender: {
        id: 1,
      },
      timestamp,
      account_linking: {
        status: 'linked'
      }
    }
    assert.equal(extractEvent(data).type, 'account_linked')
    assert.equal(extractEvent(data).timestamp, timestamp)
    assert.equal(extractEvent(data).payload, undefined)
    assert.end()
  })
  
  nest.test(`extractEvent: recognizes 'account_unlinked' events`, assert => { 
    const data = {
      sender: {
        id: 1,
      },
      timestamp,
      account_linking: {
        status: 'unlinked'
      }
    }
    assert.equal(extractEvent(data).type, 'account_unlinked')
    assert.equal(extractEvent(data).timestamp, timestamp)
    assert.equal(extractEvent(data).payload, undefined)
    assert.end()
  })
})