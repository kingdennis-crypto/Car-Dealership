import Head from 'next/head'
import Image from 'next/image'
import { useWallet } from '@/context/WalletContext'
import unauthorized from '../images/unauthorized.svg'
import { useRouter } from 'next/router'

export default function Unauthorized() {
  const router = useRouter()
  const { address, connectWallet } = useWallet()

  async function logInUser() {
    const url = router.query!.returnUrl?.toString()

    await connectWallet()

    router.push({
      pathname: url,
    })
  }

  return (
    <>
      <Head>
        <title>401 | Unauthorized</title>
      </Head>
      <div className="h-full flex items-center justify-center">
        <div className="bg-white px-4 py-8 shadow-lg rounded-md mt-8 max-w-4xl flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <Image
              src={unauthorized}
              alt="Unauthorized image"
              width={400}
              height={400}
            />
          </div>
          <p className="text-8xl">401</p>
          <p className="text-xl">
            You don&apos;t have permission to access the resource.{' '}
            {!address && (
              <>
                Try to
                <button
                  onClick={logInUser}
                  className="font-medium text-blue-600 hover:underline ml-1.5"
                >
                  log in
                </button>
              </>
            )}
          </p>
          <p className="md:mx-8 text-gray-400">
            The resource that you were attempting to access is protected and you
            don&apos; have the necessary permissions to view it.
          </p>
          {/* {!address && <button onClick={logInUser}>Log in</button>} */}
        </div>
      </div>
    </>
  )
}
