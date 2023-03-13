import { useWallet } from '@/context/WalletContext'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const { connectWallet, address } = useWallet()

  async function getStarted() {
    if (!address) {
      await connectWallet()
    }

    router.push('/cars')
  }

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main>
        <div className="mt-20 flex flex-col items-center justify-center">
          <div className="flex flex-row items-center justify-center bg-white p-4 rounded-md shadow-lg space-x-2">
            <div className="max-w-2xl relative">
              <p className="font-medium text-4xl">
                Discover your dream car at our second-hand dealership
              </p>
              <p className="mt-2 mb-4">
                Ready to take your driving experience to the next level? Our
                dealership platform has a selection of high-quality used cars to
                choose from. All at unbeatable prices. With us you can hit the
                road in style and you&apos;ll will feel confident and excited
                about your purchase. Get started today and start your adventure!
              </p>
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                onClick={getStarted}
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
