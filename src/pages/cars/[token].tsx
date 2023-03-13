// React imports
import { useEffect, useState } from 'react'
import { useWallet } from '@/context/WalletContext'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { ThirdwebStorage } from '@thirdweb-dev/storage'

import Head from 'next/head'
import Image from 'next/image'

import Car from '@/models/car'

import Modal from '@/components/layout/modal'
import InputField from '@/components/input/InputField'
import CarImage from '@/components/input/CarImage'

// TODO: Work on the mileage editor, by making sure the new cannot be lower than the old and that the mileage will be saved so that it can be called later
// TODO: Only the owner can indicate if the car is for sale and indicate an asking price, he can adjust both later

// TODO: Maintenance records and service history
export default function LicensePlate() {
  const storage = new ThirdwebStorage()
  const router = useRouter()

  const { token } = router.query
  const { callContractFunction, address, callContractFunctionWithEthers } =
    useWallet()

  const [car, setCar] = useState<Car>()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [mileage, setMileage] = useState<number>(0)
  const [images, setImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string>('')

  async function getCarDetails() {
    const _car: Car = Car.fromArray(
      await callContractFunction('getCarByToken', token)
    )

    const _data = await storage.downloadJSON(_car.metadataUri)
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
    // eslint-disable-next-line
  }, [router])

  // TODO: On buying the car reload the page or update the details
  async function buyCar() {
    console.log('Buying the car')
    const _priceInEther = ethers.utils.parseEther(car?.price.toString() || '0')
    const _data: any = await callContractFunctionWithEthers(
      'buyCar',
      _priceInEther,
      token
    )
    console.log(_data)
  }

  async function retrieveCar() {
    console.log('Retrieving the car')
    const _data: any = await callContractFunction('retrieveCar', token)
    console.log(_data)
  }

  async function cancelCarOrder() {
    console.log('Canceling car order')
    const _data: any = await callContractFunction('cancelCarOrder', token)
    console.log(_data)
  }

  async function editMileage() {
    console.log('EDITING MILEAGE')
    setIsOpen(true)
  }

  async function updateCarMileage() {
    const newMileageIsHigher = car?.mileage < mileage
    console.log(car?.mileage, mileage, newMileageIsHigher)

    // TODO: Swap with toastify
    if (!newMileageIsHigher) {
      return alert('The new mileage is not higher')
    }

    callContractFunction('changeMileage', token, mileage)
    car!.mileage = mileage
    // const _car: Car = await callContractFunction('changeMileage', token, mileage);
    // setCar(_car)
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
            <div>
              {car?.owner === address && (
                <button
                  type="button"
                  onClick={editMileage}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-4 text-center inline-flex items-center"
                >
                  <svg
                    aria-hidden="true"
                    fill="none"
                    className="w-5 h-5 mr-1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  <span className="sr-only">Icon description</span>
                  Edit Mileage
                </button>
              )}
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
        </div>

        <Modal
          title="Edit Mileage"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          footer={
            <>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={updateCarMileage}
              >
                Update Mileage
              </button>
            </>
          }
        >
          <div>
            <InputField
              id="car_mileage"
              label="Mileage"
              type="number"
              value={mileage}
              // onChange={(e) => setCar({ ...car, mileage: e })}
              onChange={(e) => setMileage(parseInt(e))}
            />
          </div>
        </Modal>
      </div>
    </>
  )
}
