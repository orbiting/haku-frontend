import App from 'next/app'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import Head from 'next/head'
import { IconContextProvider } from '../lib/icons'
import withApolloClient from '../lib/apollo/withApolloClient'
import Track from '../components/Track'

import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/theme/neo.css'

class WebApp extends App {
  render() {
    const { Component, pageProps, apolloClient, serverContext } = this.props
    return (
      <ApolloProvider client={apolloClient}>
        <IconContextProvider value={{ style: { verticalAlign: 'middle' } }}>
          <Head>
            <meta
              name='viewport'
              content='width=device-width,initial-scale=1'
            />
          </Head>
          <Component serverContext={serverContext} {...pageProps} />
          <Track />
        </IconContextProvider>
      </ApolloProvider>
    )
  }
}

export default withApolloClient(WebApp)
