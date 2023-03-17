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

    // eslint-disable-next-line
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
            {car.brand} - {car.carType}
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
      </div>
    </div>
    // </Link>
  )
}
