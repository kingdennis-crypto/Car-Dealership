import { useWallet } from '@/context/WalletContext'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import wheel from '../../images/car-wheel.png'

const selectedStyling =
  'block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0'
const unselectedStyling =
  'block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0'

// TODO: Fix flowbite and responsive
export default function Navbar() {
  const router = useRouter()
  const { address, isConnected, connectWallet } = useWallet()

  const [path, setPath] = useState<string>(router.pathname)

  useEffect(() => {
    setPath(router.pathname)
  }, [router.pathname])

  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <Link href="/" className="flex items-center">
          <Image alt="Website logo" src={wheel} width={50} height={50} />
          <span className="ml-2 self-center text-xl font-semibold whitespace-nowrap">
            Velocity Sales
          </span>
        </Link>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="flex flex-col items-center p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white">
            <li>
              <Link
                href="/"
                aria-current="page"
                className={path === '/' ? selectedStyling : unselectedStyling}
              >
                Home
              </Link>
            </li>
            {address ? (
              <>
                <li>
                  <Link
                    href="/cars"
                    className={
                      path === '/cars' ? selectedStyling : unselectedStyling
                    }
                  >
                    All Cars
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile/my-cars"
                    className={
                      path === '/profile/my-cars'
                        ? selectedStyling
                        : unselectedStyling
                    }
                  >
                    My Cars
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile/add-car"
                    className={
                      path === '/profile/add-car'
                        ? selectedStyling
                        : unselectedStyling
                    }
                  >
                    Add car
                  </Link>
                </li>
              </>
            ) : (
              <button
                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                onClick={connectWallet}
              >
                Login
              </button>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
