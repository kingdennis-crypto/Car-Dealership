import { ethers } from 'ethers'

type TokenMetaData = {
  _hex: String
  _isBigNumber: boolean
}

export default class Car {
  owner: string
  tokenId: any // FIXME: Change to a type to make accessing better
  licensePlate: string
  chassisNumber: string
  brand: string
  carType: string
  colour: string
  price: any

  constructor(
    _owner: string,
    _tokenId: number,
    _licensePlate: string,
    _chassisNumber: string,
    _brand: string,
    _carType: string,
    _colour: string,
    _price: number
  ) {
    this.owner = _owner
    this.tokenId = _tokenId
    this.licensePlate = _licensePlate
    this.chassisNumber = _chassisNumber
    this.brand = _brand
    this.carType = _carType
    this.colour = _colour
    this.price = _price
  }

  static fromArray(item: Car): Car {
    console.log(item)

    const _tokenHex = item['tokenId']['_hex'].toString(16)
    const _priceHex = item['price']['_hex'].toString(16)

    const _tokenNumber = parseInt(_tokenHex, 16)
    const _priceNumber = parseInt(_priceHex, 16)

    return new Car(
      item['owner'],
      _tokenNumber,
      item['licensePlate'],
      item['chassisNumber'],
      item['brand'],
      item['carType'],
      item['colour'],
      _priceNumber
    )
  }

  // static fromJson(item: Car): Car {
  //   return new Car()
  // }
}
