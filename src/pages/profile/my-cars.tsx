import Head from 'next/head'
import CarCard from '@/components/cards/CarCard'
import { useWallet } from '@/context/WalletContext'
import Image from 'next/image'
import emptyGarage from '../../images/empty-garage.svg'

import Car from '@/models/car'

import { useEffect, useState } from 'react'

export default function MyCars() {
  const { address, callContractFunction } = useWallet()

  const [cars, setCars] = useState<Car[]>([])

  useEffect(() => {
    getData()

    // eslint-disable-next-line
  }, [])

  async function getData() {
    const _cars: Car[] = await callContractFunction('getCarsByOwner', address)
    const _loopedCars = _cars.map((element: Car) => Car.fromArray(element))
    setCars(_loopedCars)
  }

  return (
    <>
      <Head>
        <title>My Cars</title>
      </Head>
      <div>
        <div
          className={
            cars.length
              ? 'grid grid-cols-4 gap-6'
              : 'flex items-center justify-center'
          }
        >
          {cars.length ? (
            cars.map((item, index) => <CarCard key={index} car={item} />)
          ) : (
            <div className="bg-white px-4 py-8 rounded-md mt-8 max-w-4xl flex flex-col items-center text-center space-y-4">
              <Image
                src={emptyGarage}
                alt="emtpy garage"
                width={400}
                height={400}
              />
              <p className="mt-4 text-2xl">Empty garage</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
