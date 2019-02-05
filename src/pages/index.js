import React from 'react'
import styled from 'styled-components'

import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'
import ThreadInput from '../components/ThreadInput'
import ThreadRender from '../components/ThreadRender'

import { ThreadContainer } from '../state'
import Login from '../components/Login'
import TweetButton from '../components/TweetButton'

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 10px;
`

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <h1>Write your best Twitter thread</h1>

    <Login />

    <p>Here's how it works 👇</p>
    <ol>
      <li>Write markdown</li>
      <li>
        Separate tweets with <code>---</code>
      </li>
      <li>Preview your thread</li>
      <li>Click post</li>
    </ol>
    <ThreadContainer.Provider>
      <>
        <TwoColumn>
          <div>
            <h2>Write markdown here ✍️</h2>
            <ThreadInput />
          </div>
          <div>
            <h2>Your twitter thread 👇</h2>
            <ThreadRender />
          </div>
        </TwoColumn>
        <div>
          <TweetButton />
        </div>
      </>
    </ThreadContainer.Provider>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
  </Layout>
)

export default IndexPage
