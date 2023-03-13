import Head from 'next/head'
import CarCard from '@/components/cards/CarCard'
import { useWallet } from '@/context/WalletContext'

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
        <title>All Cars</title>
      </Head>
      <div>
        <div className="grid grid-cols-4 gap-6">
          {cars.map((item, index) => (
            <CarCard key={index} car={item} />
          ))}
        </div>
      </div>
    </>
  )
}
