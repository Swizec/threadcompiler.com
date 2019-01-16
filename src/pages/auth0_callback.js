import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'

import Auth from '../Auth/Auth'
import Layout from '../components/layout'

const Auth0CallbackPage = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(
    () => {
      setMounted(true)

      const auth = new Auth()
      auth.handleAuthentication()
    },
    [mounted]
  )

  return (
    <Layout>
      <h1>
        This is the auth callback page, you should be redirected immediately.
      </h1>
      <ClipLoader sizeUnit="px" size={150} />
    </Layout>
  )
}

export default Auth0CallbackPage
