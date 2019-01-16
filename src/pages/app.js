import React from 'react'

import Layout from '../components/layout'
import Login from '../components/Login'
import Auth from '../Auth/Auth'

const auth = new Auth()

const App = () => (
  <Layout>
    <h2>Hello world</h2>
    <Login auth={auth} />
  </Layout>
)

export default App
