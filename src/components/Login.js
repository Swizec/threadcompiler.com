import React, { useState } from 'react'
import { Button } from 'reakit'
import Auth, { PRIVATE_ENDPOINT, PUBLIC_ENDPOINT } from '../utils/Auth'

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
  const [message, setMessage] = useState('')

  const callPublic = async () => {
    const res = await fetch(PUBLIC_ENDPOINT, {
      cache: 'no-store',
      method: 'POST',
    })
    const data = await res.json()

    console.log(data)
    setMessage(data.message)
  }

  const callPrivate = async () => {}

  return (
    <div>
      <Login />
      <p>{message}</p>
      <Button onClick={callPublic}>Ping Public API</Button>
      <Button onClick={callPrivate}>Ping Private API</Button>
    </div>
  )
}
