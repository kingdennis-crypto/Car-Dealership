import CarCard from '@/components/cards/CarCard'
import { useWallet } from '@/context/WalletContext'
import Car from '@/models/car'
import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Cars() {
  const { callContractFunction } = useWallet()

  const [cars, setCars] = useState<Car[]>([])

  useEffect(() => {
    getAllCars()
  }, [])

  async function getAllCars() {
    const _data: Car[] = await callContractFunction('getAllCars')
    console.log(_data)
    const _cars = _data.map((element: Car) => Car.fromArray(element))
    setCars(_cars)
  }

  return (
    <>
      <Head>
        <title>All Cars</title>
      </Head>
      <div>
        <div className="flex flex-row space-x-4">
          <div className="w-1/5 bg-green-400"></div>
          <div className="w-4/5 grid grid-cols-4 gap-6">
            {cars.map((item, index) => (
              <CarCard key={index} car={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
