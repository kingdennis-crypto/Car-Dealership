import Car from '@/models/car'
import Link from 'next/link'

type CarProp = {
  car: Car
}

// owner: string
// tokenId: any
// licensePlate: string
// chassisNumber: string
// brand: string
// carType: string
// colour: string
// price: any
// sold: boolean
// buyer: string

export default function CarCard({ car }: CarProp) {
  return (
    // <Link href={`/cars/${car.tokenId}`}>
    <div className="bg-white p-3 rounded-lg hover:scale-105 transition-transform">
      <div className="bg-green-200 aspect-square rounded-md">
        <p>Image</p>
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
      <hr className="my-4 bg-black h-0.5 " />
      <div className="flex flex-row space-x-2">
        <Link
          href={`/cars/${car.tokenId}`}
          className="flex items-center justify-center w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5"
        >
          Details
        </Link>
        <button className="flex items-center justify-center w-full text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5">
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
        </button>
      </div>
    </div>
    // </Link>
  )
}
