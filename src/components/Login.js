import React from 'react'
import { Button } from 'reakit'
import Auth from '../utils/auth'

const auth = new Auth()

const Login = () => {
  const { isAuthenticated } = auth

  if (isAuthenticated()) {
    return <Button onClick={auth.logout}>Logout {auth.getUserName()}</Button>
  } else {
    return <Button onClick={auth.login}>Login</Button>
  }
}

export default () => {
  return (
    <div>
      <Login />
    </div>
  )
}
