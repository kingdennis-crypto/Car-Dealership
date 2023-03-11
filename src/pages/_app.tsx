import Layout from '@/components/layout/layout'
import { WalletProvider } from '@/context/WalletContext'
import RouteGuard from '@/guards/routeGuard'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WalletProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WalletProvider>
    </>
  )
}

{
  /* </RouteGuard> */
}
