import useWallet from '@/hooks/useWallet'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'

type Props = {
  children: ReactNode
}

/**
 * A route guard component that checks if a user is authorized to access a specific page or not.
 * If not authorized, the component redirects to the unauthorized page.
 * If authorized, the component renders the children.
 *
 * @param {object} props - The props object containing the children to render.
 * @returns {ReactNode} The JSX element to render.
 */
export default function RouteGuard({ children }: Props): ReactNode {
  const userWallet = useWallet()
  const router = useRouter()

  const [authorized, setAuthorized] = useState<boolean>(false)

  useEffect(() => {
    // On initial load - run auth check
    authCheck(router.pathname.split('/').slice(1)[0])

    // On route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false)
    router.events.on('routeChangeStart', hideContent)

    // On route change complete - run auth check
    router.events.on('routeChangeComplete', authCheck)

    // Unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent)
      router.events.off('routeChangeComplete', authCheck)
    }

    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    // Re-run auth chcek when the wallet account changes
    authCheck(router.pathname.split('/').slice(1)[0])

    // eslint-disable-next-line
  }, [userWallet.wallet])

  /**
   * Function that checks if a user is authorized to access a specific page or not.
   * If not authorized, the function redirects to the unauthorized page.
   *
   * @param {string} url - The URL of the page being accessed.
   * @returns {void}
   */
  const authCheck = async (url: string): Promise<void> => {
    // Redirect to login page if accessing a private page and not logged in
    const wallet = await userWallet.getWallet()
    console.log('WALLET', wallet)
    const restrictedPaths: string[] = ['profile']

    // TODO: Add function that waits for the user login, if logged in redirect to original page

    if (restrictedPaths.includes(url) && !wallet) {
      setAuthorized(false)
      router.push({
        pathname: '/unauthorized',
        query: { returnUrl: router.pathname },
      })
    } else {
      setAuthorized(true)
    }
  }

  return authorized ? children : <p>Loading...</p>
}
