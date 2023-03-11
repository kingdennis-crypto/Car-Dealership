// import useWallet from '@/hooks/useWallet'
import CarCard from '@/components/cards/CarCard'
import { useWallet } from '@/context/WalletContext'

import useEthers from '@/hooks/useEthers'
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
    // const _loopedCars = _cars.forEach((element: Car) => element.licensePlate)

    const _loopedCars = _cars.map((element: Car) => Car.fromArray(element))

    console.log(_loopedCars)
    setCars(_loopedCars)
  }

  return (
    <div>
      <p>My Cars</p>
      {/* <button onClick={getCars}>Load cars</button> */}
      {cars.map((item, index) => {
        // return <p key={index}>{item.tokenId}</p>
        return <CarCard car={item} key={index} />
      })}
    </div>
  )
}
