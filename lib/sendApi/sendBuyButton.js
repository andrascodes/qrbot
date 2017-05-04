'use strict'

const fetch = require('node-fetch')

const sendBuyButton = accessToken => (recipient) => {

  const body = {
    recipient: {
      id: recipient,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Welcome to Peters Hats',
              image_url: 'http://i.imgur.com/dORdxei.png',
              subtitle: 'We have got the best hats',
              // default_action: {
              //   type: 'web_url',
              //   url: 'http://i.imgur.com/dORdxei.png',
              //   messenger_extensions: false,
              //   webview_height_ratio: 'tall',
              //   fallback_url: 'http://i.imgur.com/dORdxei.png'
              // },
              buttons: [
                {
                  type: 'payment',
                  title: 'Buy',
                  payload: 'BUY PAYLOAD',
                  payment_summary: {
                    currency: 'USD',
                    payment_type: 'FIXED_AMOUNT',
                    is_test_payment: true,
                    merchant_name: 'Peters Hats',
                    requested_user_info: [
                      "shipping_address",
                      "contact_name",
                      "contact_phone",
                      "contact_email"
                    ],
                    price_list:[
                      {
                        "label":"Subtotal",
                        "amount":"29.99"
                      },
                      {
                        "label":"Taxes",
                        "amount":"2.47"
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      }
    }
  }

  return fetch(`https://graph.facebook.com/v2.6/me/messages?access_token=${accessToken}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(res => res.json())
}

module.exports = sendBuyButton

// sendRequest(body, endpoint, method) {
//   endpoint = endpoint || 'messages';
//   method = method || 'POST';
//   return fetch(`https://graph.facebook.com/v2.6/me/${endpoint}?access_token=${this.accessToken}`, {
//     method,
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(body)
//   })
//   .then(res => res.json())
//   .then(resJSON => {
//     if(this.analytics) {
//       this.analytics.logOutgoing(body, resJSON)
//     }
//   })
//   .catch(err => console.log(`Error sending message: ${err}`));
// }