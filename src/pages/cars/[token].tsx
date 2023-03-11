import { useEffect, useState } from 'react'
import useEthers from '@/hooks/useEthers'
import { useWallet } from '@/context/WalletContext'
import { useRouter } from 'next/router'
import Car from '@/models/car'

export default function LicensePlate() {
  const router = useRouter()

  const { token } = router.query
  const { callContractFunction, address } = useWallet()

  const [car, setCar] = useState<Car | null>(null)

  async function getCarDetails() {
    const _car: Car = Car.fromArray(
      await callContractFunction('getCarByToken', token)
    )

    console.log(_car.owner === address)
    setCar(_car)
  }

  useEffect(() => {
    if (!token) {
      return
    }

    getCarDetails()
    // eslint-disable-next-line
  }, [router])

  function buyCar() {}

  return (
    <>
      <p>CAR DETAILS</p>
      <p>{car?.licensePlate}</p>
      <p>{car?.chassisNumber}</p>
      <p>{car?.brand}</p>
      <p>{car?.carType}</p>
      <p>{car?.colour}</p>
      <p>{car?.price}</p>
      {car?.owner !== address && (
        <div>
          <button
            type="button"
            className="text-white bg-blue-500 hover:bg-blue-600 rounded-md py-2 px-4"
          >
            Buy
          </button>
        </div>
      )}
    </>
  )
}
