const jwt = require('jsonwebtoken')
const logger = require('./logger')
const secrets = require('./secrets.json')

// Set in `environment` of serverless.yml
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID || secrets.AUTH0_CLIENT_ID
const AUTH0_CLIENT_PUBLIC_KEY =
  process.env.AUTH0_CLIENT_PUBLIC_KEY || secrets.AUTH0_CLIENT_PUBLIC_KEY
const AUTH0_MGMT_CLIENT_ID =
  process.env.AUTH0_MGMT_CLIENT_ID || secrets.AUTH0_MGMT_CLIENT_ID
const AUTH0_MGMT_CLIENT_SECRET =
  process.env.AUTH0_MGMT_CLIENT_SECRET || secrets.AUTH0_MGMT_CLIENT_SECRET
const TWITTER_CONSUMER_KEY =
  process.env.TWITTER_CONSUMER_KEY || secrets.TWITTER_CONSUMER_KEY
const TWITTER_CONSUMER_SECRET =
  process.env.TWITTER_CONSUMER_SECRET || secrets.TWITTER_CONSUMER_SECRET

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
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
})

// Talk to Auth0 to get our token
async function getAuth0Token() {
  const response = await post('https://threadcompiler.auth0.com/oauth/token', {
    headers: { 'content-type': 'application/json' },
    body: {
      client_id: AUTH0_MGMT_CLIENT_ID,
      client_secret: AUTH0_MGMT_CLIENT_SECRET,
      audience: 'https://threadcompiler.auth0.com/api/v2/',
      grant_type: 'client_credentials',
    },
  })

  console.log('GOT auth token', response.statusCode, response.data)
  return response.data
}

// Send a tweet
async function tweet(text, identity) {
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

// Talk to Auth0 to get provider tokens
async function getUserToken(userId, access_token, token_type) {
  const response = await get(
    `https://threadcompiler.auth0.com/api/v2/users/${userId}`,
    {
      headers: { authorization: `${token_type} ${access_token}` },
    }
  )
  console.log('user token response', response.statusCode, response.data)
  return response.data
}

// Private API -- tweets stuff
module.exports.privateEndpoint = async (event, context, callback) => {
  const { user_id, message } = JSON.parse(event.body)

  console.log(user_id)

  try {
    const auth0token = await getAuth0Token()
    const userToken = await getUserToken(
      user_id,
      auth0token.access_token,
      auth0token.token_type
    )
    const identity = userToken.identities.find(id => id.provider === 'twitter')
    console.log('Found identity', identity)
    console.log('ABOUT TO TWEET')
    const tweetResponse = await tweet(message, identity)

    callback(null, {
      statusCode: 200,
      headers: {
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: tweetResponse,
      }),
    })
  } catch (err) {
    console.error('HUGE ERROR', err)
    callback(err)
  }
}
