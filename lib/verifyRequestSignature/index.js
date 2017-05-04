'use strict'

const verifyRequestSignature = (crypto, appSecret) => (req, res, buf) => {
  const signature = req.headers["x-hub-signature"]
  if(!signature) {
    throw new Error('Could not validate signature')
  }
  else {
    const elements = signature.split('=')
    const method = elements[0]
    const signatureHash = elements[1]
    
    const expectedHash = crypto.createHmac('sha1', appSecret)
                          .update(buf)
                          .digest('hex')

    if(signatureHash != expectedHash) {
      throw new Error('Could not validate the request signature')
    }
  }
}

module.exports = verifyRequestSignature