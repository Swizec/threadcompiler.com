const jwt = require('jsonwebtoken')

// Set in `environment` of serverless.yml
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID
const AUTH0_CLIENT_PUBLIC_KEY = process.env.AUTH0_CLIENT_PUBLIC_KEY

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {}
  authResponse.principalId = principalId
  if (effect && resource) {
    const policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    const statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }
  return authResponse
}

// Reusable Authorizer function, set on `authorizer` field in serverless.yml
module.exports.auth = (event, context, callback) => {
  console.log('event', event)
  if (!event.authorizationToken) {
    return callback('Unauthorized')
  }

  const tokenParts = event.authorizationToken.split(' ')
  const tokenValue = tokenParts[1]

  if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    // no auth token!
    return callback('Unauthorized')
  }
  const options = {
    audience: AUTH0_CLIENT_ID,
  }

  try {
    jwt.verify(
      tokenValue,
      AUTH0_CLIENT_PUBLIC_KEY,
      options,
      (verifyError, decoded) => {
        if (verifyError) {
          console.log('verifyError', verifyError)
          // 401 Unauthorized
          console.log(`Token invalid. ${verifyError}`)
          return callback('Unauthorized')
        }
        // is custom authorizer function
        console.log('valid from customAuthorizer', decoded)
        return callback(
          null,
          generatePolicy(decoded.sub, 'Allow', event.methodArn)
        )
      }
    )
  } catch (err) {
    console.log('catch error. Invalid token', err)
    return callback('Unauthorized')
  }
}

// Public API
module.exports.publicEndpoint = (event, context, callback) =>
  callback(null, {
    statusCode: 200,
    headers: {
      /* Required for CORS support to work */
      'Access-Control-Allow-Origin': '*',
      /* Required for cookies, authorization headers with HTTPS */
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      message: 'Hi ⊂◉‿◉つ from Public API',
    }),
  })

// import { get, post } from 'httpie'
const { get, post } = require('httpie')
const twitterAPI = require('node-twitter-api')
const twitter = new twitterAPI({
  consumerKey: 'tVBa6sa74Hzx2JQmoXcrvDLL7',
  consumerSecret: 'REUokZOd1Pt1XfAgpRxAcpSDnxwjfx3PU1jmt1MVbSijhGrt0K',
})

function getAuth0Token() {
  return post('https://threadcompiler.auth0.com/oauth/token', {
    headers: { 'content-type': 'application/json' },
    body: {
      client_id: 'u52yBEMCsXbQtRJcpYWvmBHLb3fa7CmL',
      client_secret:
        'YEil53VlNVpBVttEOpGlPU8wPM3aQqAC5lnW2u9IYErUjyyC0Tk0Axn9gPjvOWUG',
      audience: 'https://threadcompiler.auth0.com/api/v2/',
      grant_type: 'client_credentials',
    },
  }).then(response => {
    console.log('GOT auth token', response.statusCode, response.data)
    return response.data
  })
}

function tweet(text, identity) {
  return new Promise((resolve, reject) => {
    twitter.statuses(
      'update',
      {
        status: text,
      },
      identity.access_token,
      identity.access_token_secret,
      (err, data, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      }
    )
  })
}

function getUserToken(userId, access_token, token_type) {
  return get(`https://threadcompiler.auth0.com/api/v2/users/${userId}`, {
    headers: { authorization: `${token_type} ${access_token}` },
  }).then(response => {
    console.log('user token response', response.statusCode, response.data)
    return response.data
  })
}

// Private API
module.exports.privateEndpoint = (event, context, callback) => {
  console.log(event)

  getAuth0Token()
    .then(response =>
      getUserToken(
        'twitter|15353121',
        response.access_token,
        response.token_type
      )
    )
    .then(response => {
      const identity = response.identities.find(id => id.provider === 'twitter')

      return identity
    })
    .then(identity =>
      tweet('I tweeted this from a serverless AWS Lambda ✌️', identity)
    )
    .then(response => {
      callback(null, {
        statusCode: 200,
        headers: {
          /* Required for CORS support to work */
          'Access-Control-Allow-Origin': '*',
          /* Required for cookies, authorization headers with HTTPS */
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: `Hi ⊂◉‿◉つ from Private API. ${JSON.stringify(response)}`,
        }),
      })
    })
    .catch(err => {
      console.log('HUGE ERROR', err)
      callback(err)
    })
}
