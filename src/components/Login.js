import React, { useEffect } from 'react'
import { Button } from 'reakit'

const Login = ({ auth }) => {
  const { isAuthenticated } = auth
  // equal to: const isAuthenticated = auth.isAuthenticated

  if (isAuthenticated()) {
    return <Button onClick={auth.logout}>Logout</Button>
  } else {
    return <Button onClick={auth.login}>Login</Button>
  }
}

export default Login
