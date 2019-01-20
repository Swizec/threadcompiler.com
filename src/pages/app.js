import React from 'react'

import Layout from '../components/layout'
import Login from '../components/Login'
import Auth from '../utils/auth'

const App = () => {
  const auth = new Auth()
  return (
    <Layout>
      <h2>Hello world</h2>
      <Login auth={auth} />
    </Layout>
  )
}

export default App
