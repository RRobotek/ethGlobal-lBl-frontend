import { SessionProvider } from "next-auth/react"
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from "next/app"
import type { Session } from "next-auth"

// You can import a custom theme here if you have one
// import theme from '../path/to/your/theme'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ChakraProvider>
  )
}
