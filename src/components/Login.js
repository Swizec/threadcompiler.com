import React from 'react'
import { Button } from 'reakit'

import useComponentDidMount from '../useComponentDidMount'

const Login = ({ auth }) => {
  const { isAuthenticated, renewSession } = auth

  useComponentDidMount(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      console.log('Infinite loop?')
      renewSession()
    }
  })

  if (isAuthenticated()) {
    return <Button onClick={auth.logout}>Logout {auth.getUserName()}</Button>
  } else {
    return <Button onClick={auth.login}>Login</Button>
  }
}

export default Login
