import CarCard from '@/components/cards/CarCard'
import InputField from '@/components/input/InputField'
import { useWallet } from '@/context/WalletContext'
import Car from '@/models/car'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import carDealership from '../images/car-dealership.svg'
import Image from 'next/image'

type FilterOptions = {
  brand: string
  type: string
  colour: string
  price: number
}

export default function Cars() {
  const { callContractFunction, dealership, address } = useWallet()

  const [cars, setCars] = useState<Car[]>([])
  const [filterData, setFilterData] = useState<FilterOptions>({
    brand: '',
    type: '',
    colour: '',
    price: 0,
  })
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [isFiltering, setIsFiltering] = useState<boolean>(false)

  useEffect(() => {
    getAllCars()

    // eslint-disable-next-line
  }, [])

  async function getAllCars() {
    const _data: Car[] = await callContractFunction('getAllCars')

    const _cars = _data.map((element: Car) => Car.fromArray(element))

    if (address !== dealership) {
      setCars(_cars.filter((element: Car) => element.forSale === true))
    } else {
      setCars(_cars)
    }
  }

  async function filterCars() {
    const { brand, type, colour, price } = filterData
    const _filtered = cars.filter((item: Car) => {
      return (
        (!brand || item.brand === brand) &&
        (!type || item.carType === type) &&
        (!colour || item.colour === colour) &&
        (!price || item.price === price)
      )
    })
    console.log(filterData)
  }

  return (
    <>
      <Head>
        <title>All Cars</title>
      </Head>
      <div>
        <div className="flex flex-row space-x-4">
          <div className="w-1/5 bg-white rounded-md p-4">
            <div className="space-y-2">
              <p className="text-lg">Filter</p>
              <hr />
              <InputField
                id="car_brand"
                label="Brand"
                type="select"
                value={filterData!.brand}
                onChange={(e) => setFilterData({ ...filterData!, brand: e })}
                selectItems={Car.BRAND}
              />
              <InputField
                id="car_type"
                label="Type"
                type="select"
                value={filterData!.type}
                onChange={(e) => setFilterData({ ...filterData!, type: e })}
                selectItems={Car.TYPE}
              />
              <InputField
                id="car_colour"
                label="Colour"
                type="select"
                value={filterData!.colour}
                onChange={(e) => setFilterData({ ...filterData!, colour: e })}
                selectItems={Car.BRAND}
              />
              <InputField
                id="car_price"
                label="Price"
                type="number"
                value={filterData!.price}
                onChange={(e) =>
                  setFilterData({ ...filterData, price: parseInt(e) })
                }
              />
              <div className="flex flex-row gap-2">
                <button
                  onClick={filterCars}
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Filter
                </button>
                <button className="w-full text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5">
                  Clear
                </button>
              </div>
            </div>
          </div>
          <div className="w-4/5 grid grid-cols-4 gap-6">
            {cars.length ? (
              cars.map((item) => <CarCard key={item.tokenId} car={item} />)
            ) : (
              <div className="bg-white px-4 py-8 rounded-md flex flex-col items-center text-center space-y-4 relative">
                <div>
                  <Image
                    src={carDealership}
                    alt="No listed cars"
                    sizes="100%"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <p className="mt-4 text-2xl">No cars are listed</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
