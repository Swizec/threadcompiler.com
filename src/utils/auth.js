import auth0 from 'auth0-js'
import { navigate } from 'gatsby'

const AUTH0_DOMAIN = 'threadcompiler.auth0.com'
const CALLBACK_DOMAIN =
  typeof window !== 'undefined' ? window.location.host : 'localhost:8000'
const PROTOCOL =
  typeof window !== 'undefined' ? window.location.protocol : 'http:'
const AUTH0_CLIENT_ID = 'qFnKgffxd1egZwn4FaTqCD17x4XuBDDJ'
export const PUBLIC_ENDPOINT =
  'https://2x2vvyzhh5.execute-api.us-west-2.amazonaws.com/dev/api/public'
export const PRIVATE_ENDPOINT =
  'https://2x2vvyzhh5.execute-api.us-west-2.amazonaws.com/dev/api/private'

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: `${PROTOCOL}//${CALLBACK_DOMAIN}/auth0_callback`,
    audience: `https://${AUTH0_DOMAIN}/api/v2/`,
    responseType: 'token id_token',
    scope: 'openid profile email',
  })

  login = () => {
    this.auth0.authorize()
  }

  logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    localStorage.removeItem('user')
  }

  handleAuthentication = () => {
    if (typeof window !== 'undefined') {
      // this must've been the trick
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setSession(authResult)
        } else if (err) {
          console.log(err)
        }

        // Return to the homepage after authentication.
        navigate('/')
      })
    }
  }

  isAuthenticated = () => {
    if (typeof localStorage !== 'undefined') {
      const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
      return new Date().getTime() < expiresAt
    } else {
      return false
    }
  }

  setSession = authResult => {
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    )
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)

    this.auth0.client.userInfo(authResult.accessToken, (err, user) => {
      localStorage.setItem('user', JSON.stringify(user))
    })
  }

  getUser = () => {
    if (localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user'))
    }
  }

  getUserName = () => {
    if (this.getUser()) {
      return this.getUser().name
    }
  }

  getToken = () => {
    return localStorage.getItem('id_token')
  }
}
