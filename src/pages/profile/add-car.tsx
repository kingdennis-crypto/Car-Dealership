import FileField from '@/components/input/FileField'
import ImagePreview from '@/components/input/ImagePreview'
import InputField from '@/components/input/InputField'
import { useWallet } from '@/context/WalletContext'
import Car from '@/models/car'
import Head from 'next/head'
import { useEffect, useState } from 'react'

import { ThirdwebStorage } from '@thirdweb-dev/storage'

export default function AddCar() {
  const storage = new ThirdwebStorage()
  const { address, callContractFunction } = useWallet()

  const [car, setCar] = useState<Car>(Car.DEFAULT)
  const [file, setFile] = useState<File[]>([])
  const [creating, setCreating] = useState<boolean>(false)
  const [loadingMessage, setLoadingMessage] = useState<string>('Creating...')

  function imageText() {
    const _images = Array.from(file)
    return _images.length > 1 ? 'images' : 'image'
  }

  async function mintCar() {
    setCreating(true)
    setLoadingMessage(`Uploading ${imageText()}...`)
    const metadata = {
      images: file,
    }

    const uri = await storage.upload(metadata)

    // TODO: Do a check for if the car is not the same as the defaultCar
    setLoadingMessage('Creating car...')
    const _car = await callContractFunction(
      'mintCar',
      address,
      car.licensePlate,
      car.chassisNumber,
      car.brand,
      car.carType,
      car.colour,
      car.mileage,
      car.price,
      uri
    )

    setLoadingMessage('Asking for the receipt...')
    const receipt = await _car.wait()
    console.log(receipt)

    setCreating(false)
  }

  return (
    <>
      <Head>
        <title>Add Car</title>
      </Head>
      <main>
        <div className="max-w-5xl mx-auto bg-white p-4 shadow-sm rounded-md">
          <div className="space-y-2">
            <p className="text-4xl font-semibold">Add car</p>
            <hr />
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                id="car_license_plate"
                label="License Plate"
                type="text"
                value={car.licensePlate}
                onChange={(e) => setCar({ ...car, licensePlate: e })}
              />
              <InputField
                id="car_chassis_number"
                label="Chassis Number"
                type="number"
                value={car.chassisNumber.toString()}
                onChange={(e) => setCar({ ...car, chassisNumber: e })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                id="car_brand"
                label="Brand"
                type="select"
                value={car.brand}
                onChange={(e) => setCar({ ...car, brand: e })}
                selectItems={Car.BRAND}
              />
              <InputField
                id="car_type"
                label="Type"
                type="select"
                value={car.carType}
                onChange={(e) => setCar({ ...car, carType: e })}
                selectItems={Car.TYPE}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <InputField
                id="car_colour"
                label="Colour"
                type="select"
                value={car.colour}
                onChange={(e) => setCar({ ...car, colour: e })}
                selectItems={Car.COLOUR}
              />
              <InputField
                id="car_mileage"
                label="Mileage"
                type="number"
                value={car.mileage}
                onChange={(e) => setCar({ ...car, mileage: parseInt(e) })}
              />
              <InputField
                id="car_price"
                label="Price"
                type="number"
                value={car.price.toString()}
                onChange={(e) => setCar({ ...car, price: parseInt(e) })}
              />
            </div>
            <div>
              <FileField
                value={file}
                onChange={(e) => {
                  // TODO: If you add image check if image already exists, if not add to array
                  setFile(e)
                }}
              />
              {file.length !== 0 && (
                <div className="mt-2">
                  <p className="block mb-2 text-sm font-medium text-gray-900">
                    Selected images
                  </p>
                  <div className="relative overflow-auto">
                    <div className="flex flex-nowrap gap-4">
                      {Array.from(file).map((item, index) => (
                        <ImagePreview
                          key={index}
                          image={item}
                          onChange={(e) => {
                            const images = Array.from(file).filter(
                              (item) => item !== e
                            )
                            setFile(images)
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={mintCar}
              className={`text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 ${
                creating
                  ? 'cursor-not-allowed bg-blue-400'
                  : 'bg-blue-700 hover:bg-blue-800'
              } `}
              disabled={creating}
            >
              {creating ? (
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
                  {loadingMessage}
                </>
              ) : (
                <>Add car</>
              )}
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
