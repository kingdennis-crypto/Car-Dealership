// React imports
import { useEffect, useState } from 'react'
import { useWallet } from '@/context/WalletContext'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { ThirdwebStorage } from '@thirdweb-dev/storage'
import dateformat from 'dateformat'

import Head from 'next/head'
import Image from 'next/image'

import Car from '@/models/car'

import Modal from '@/components/layout/modal'
import InputField from '@/components/input/InputField'
import CarImage from '@/components/input/CarImage'
import Mileage from '@/models/mileage'

type EditMenuDetail = {
  type: number
  title: string
  isOpen: boolean
}

export default function LicensePlate() {
  const storage = new ThirdwebStorage()
  const router = useRouter()

  const { token } = router.query
  const { callContractFunction, address, callContractFunctionWithEthers } =
    useWallet()

  const [car, setCar] = useState<Car>()
  const [mileage, setMileage] = useState<number>(0)
  const [images, setImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [mileageHistory, setMileageHistory] = useState<Mileage[]>([])

  const [editMenu, setEditMenu] = useState<EditMenuDetail>({
    title: 'None',
    type: 0,
    isOpen: false,
  })

  async function getCarDetails() {
    const _carData = await callContractFunction('getCarByToken', token)

    if (!_carData) {
      return alert('Error fetching car')
    }

    const _car: Car = Car.fromArray(_carData)

    const _data = await storage.downloadJSON(_car.metadataUri)

    if (!_data) {
      return alert('Error downloading metadata')
    }

    const _images: string[] = Object.values(_data.images)

    setImages(_images)
    setSelectedImage(_images[0])

    setCar(_car)
    setMileage(_car.mileage)
  }

  useEffect(() => {
    if (!token) {
      return
    }

    getCarDetails()
    getMileageHistory()
    // eslint-disable-next-line
  }, [router])

  // TODO: On buying the car reload the page or update the details
  async function buyCar() {
    const _priceInEther = ethers.utils.parseEther(car?.price.toString() || '0')
    await callContractFunctionWithEthers('buyCar', _priceInEther, token)
  }

  async function retrieveCar() {
    const _data: any = await callContractFunction('retrieveCar', token)
  }

  async function cancelCarOrder() {
    const _data: any = await callContractFunction('cancelCarOrder', token)
  }

  async function getMileageHistory() {
    const _data: Mileage[] = await callContractFunction(
      'getCarMileageHistory',
      token
    )

    const _mileage = _data.map((item) => Mileage.fromArray(item))
    setMileageHistory(_mileage)
  }

  async function addMileageToHistory() {
    if (mileage <= car?.mileage) {
      return alert('New car mileage is not high enough')
    }

    const now = new Date()
    const _mileage = new Mileage(parseInt(car?.tokenId), mileage, now)

    const _data: any = await callContractFunction(
      'addMileageReport',
      token,
      mileage,
      now.valueOf()
    )

    car!.mileage = mileage
    setMileageHistory([...mileageHistory, _mileage])
  }

  async function updatePrice() {
    const _data: any = await callContractFunction(
      'changeCarPrice',
      token,
      car?.price
    )
    console.log(_data)
  }

  async function updateAvailability() {
    const _data: any = await callContractFunction(
      'changeCarAvailability',
      token,
      car?.forSale
    )
    console.log(_data)
  }

  return (
    <>
      <Head>
        <title>{`Car | ${car?.licensePlate}`}</title>
      </Head>
      <div className="flex flex-col md:flex-row space-x-4">
        <div className="w-1/6 max-h-screen bg-white rounded-md p-4 overflow-y-scroll">
          {/* TODO: Make height max of the height of the default sidebar height */}
          <div className="overflow-y-scroll">
            <div className="flex flex-col gap-2">
              {images.map((item, index) => (
                <CarImage
                  url={item}
                  key={index}
                  clickHandler={(e) => {
                    setSelectedImage(e)
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="w-3/6 relative aspect-square">
          <Image
            className="rounded-md"
            src={selectedImage}
            alt="Car main image"
            sizes="100%"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="w-2/6 p-4 bg-white rounded-md">
          <div className="flex flex-row justify-between">
            <div>
              <p className="text-gray-900 text-3xl font-bold">
                {car?.licensePlate}
              </p>
              <p className="text-gray-400 font-light">
                {car?.brand} - {car?.carType} - {car?.mileage}KM
              </p>
              <div className="flex flex-row items-center justify-start">
                <p>{car?.price} ETH</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 border-2 hover:bg-gray-100 rounded-md aspect-square"
            >
              <svg
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12"
              >
                <path
                  d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
          </div>
          <hr className="my-4" />
          {isEditing && (
            <>
              <div className="flex flex-row gap-2">
                <button
                  onClick={() =>
                    setEditMenu({
                      title: 'Add mileage report',
                      type: 1,
                      isOpen: true,
                    })
                  }
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Add Mileage
                </button>
                <button
                  onClick={() =>
                    setEditMenu({
                      title: 'Change price',
                      type: 2,
                      isOpen: true,
                    })
                  }
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Change Price
                </button>
                <button
                  onClick={() =>
                    setEditMenu({
                      title: 'Change availability',
                      type: 3,
                      isOpen: true,
                    })
                  }
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Change Availability
                </button>
              </div>
              <hr className="my-4" />
            </>
          )}

          <div>
            <div className="relative overflow-x-auto overflow-hidden rounded-md">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 w-1/2">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/2">
                      Mileage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mileageHistory.map((item, index) => (
                    <tr key={index} className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {dateformat(item.date)}
                      </th>
                      <td className="px-6 py-4">{item.mileage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <hr className="my-4" />

          {car?.owner !== address && (
            <div>
              {car?.sold ? (
                <>
                  {car.buyer === address ? (
                    <div className="flex flex-row space-x-2 mt-2">
                      <button
                        type="button"
                        onClick={cancelCarOrder}
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center"
                      >
                        <svg
                          className="w-5 h-5 mr-2 -ml-1"
                          aria-hidden="true"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 18L18 6M6 6l12 12"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                        Cancel order
                      </button>
                      <button
                        type="button"
                        onClick={retrieveCar}
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center"
                      >
                        Collect Car
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 ml-2 -mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="text-white bg-blue-400 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      disabled
                    >
                      Sold
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  className="w-full text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-md text-sm px-5 py-2.5 text-center inline-flex items-center"
                  onClick={buyCar}
                >
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
                  Pay with Ethereum
                </button>
              )}
            </div>
          )}

          <Modal
            title={editMenu.title}
            isOpen={editMenu.isOpen}
            onClose={() => setEditMenu({ ...editMenu, isOpen: false })}
          >
            <hr className="my-2" />
            <div>
              {editMenu.type === 1 && (
                <>
                  <InputField
                    id="addMileage"
                    type="number"
                    label="Add Mileage"
                    placeholder="Mileage"
                    value={mileage}
                    onChange={(e) => setMileage(parseInt(e))}
                  />
                  <button
                    onClick={addMileageToHistory}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2"
                  >
                    Add Mileage
                  </button>
                </>
              )}
              {editMenu.type === 2 && (
                <>
                  <InputField
                    id="changePrice"
                    type="number"
                    label="Change price"
                    placeholder="price"
                    value={car?.price}
                    onChange={(e) => setCar({ ...car!, price: parseInt(e) })}
                  />
                  <button
                    onClick={updatePrice}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2"
                  >
                    Change Price
                  </button>
                </>
              )}
              {editMenu.type === 3 && (
                <>
                  <ul className="flex flex-col w-full gap-2">
                    <li>
                      <input
                        type="radio"
                        id="hosting-small"
                        name="hosting"
                        checked={Number(car?.forSale) === 0}
                        value={Number(car?.forSale)}
                        onChange={() => setCar({ ...car!, forSale: false })}
                        className="hidden peer"
                        required
                      />
                      <label
                        htmlFor="hosting-small"
                        className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100"
                      >
                        <div className="block">
                          <div className="w-full text-lg font-semibold">
                            Not for sale
                          </div>
                          <div className="w-full">
                            If you don&apos;t wan&apos;t your car to be buyable
                          </div>
                        </div>
                        <svg
                          aria-hidden="true"
                          className="w-6 h-6 ml-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </label>
                    </li>
                    <li>
                      <input
                        type="radio"
                        id="hosting-big"
                        name="hosting"
                        className="hidden peer"
                        checked={Number(car?.forSale) === 1}
                        value={Number(car?.forSale)}
                        onChange={() => setCar({ ...car!, forSale: true })}
                      />
                      <label
                        htmlFor="hosting-big"
                        className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100"
                      >
                        <div className="block">
                          <div className="w-full text-lg font-semibold">
                            For sale
                          </div>
                          <div className="w-full">
                            If you want to sell your car
                          </div>
                        </div>
                        <svg
                          aria-hidden="true"
                          className="w-6 h-6 ml-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </label>
                    </li>
                  </ul>
                  <button
                    onClick={updateAvailability}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2"
                  >
                    Update availability
                  </button>
                </>
              )}
            </div>
          </Modal>
        </div>
      </div>
    </>
  )
}
