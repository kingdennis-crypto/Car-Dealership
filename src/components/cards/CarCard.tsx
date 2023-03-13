import { useWallet } from '@/context/WalletContext'
import Car from '@/models/car'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ThirdwebStorage } from '@thirdweb-dev/storage'

type CarProp = {
  car: Car
}

export default function CarCard({ car }: CarProp) {
  const router = useRouter()
  const storage = new ThirdwebStorage()

  const { callContractFunctionWithEthers, address } = useWallet()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [image, setImage] = useState<string>('')

  useEffect(() => {
    downloadImage()
  }, [])

  async function downloadImage() {
    const _data = await storage.downloadJSON(car.metadataUri)
    const _images: string[] = Object.values(_data.images)
    setImage(_images[0])
  }

  async function buyCar() {
    setIsLoading(true)

    const _priceInEther = ethers.utils.parseEther(car?.price.toString() || '0')
    await callContractFunctionWithEthers('buyCar', _priceInEther, car.tokenId)

    setIsLoading(false)

    router.push({
      pathname: `/cars/${car.tokenId}`,
    })
  }

  return (
    <div className="bg-white p-3 rounded-lg hover:scale-105 transition-transform">
      <div className="relative aspect-square rounded-md overflow-hidden">
        {/* TODO: Add fallback image support */}
        <Image
          src={image}
          alt="Image Name"
          sizes="100%"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="my-2">
        <div className="flex flex-row justify-between">
          <p>
            {car.brand} {car.carType}
          </p>
          <p>{car.mileage}KM</p>
        </div>
        <p>{car.colour}</p>
        <div className="flex flex-row items-center justify-between">
          <p>{car.price} ETH</p>
          <p>{car.sold ? 'Sold' : 'Not sold'}</p>
        </div>
      </div>
      <hr className="mb-4 mt-2 bg-black h-0.5 " />
      <div className="flex flex-row space-x-2">
        <Link
          href={`/cars/${car.tokenId}`}
          className="w-full inline-flex justify-center items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Details
        </Link>

        {address !== car.owner && (
          <button
            className="flex items-center justify-center w-full text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5"
            onClick={buyCar}
          >
            {isLoading ? (
              <>
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 mr-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2 -ml-1 text-[#626890]"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="ethereum"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path
                    fill="currentColor"
                    d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"
                  ></path>
                </svg>
                Buy now
              </>
            )}
          </button>
        )}
      </div>
    </div>
    // </Link>
  )
}
