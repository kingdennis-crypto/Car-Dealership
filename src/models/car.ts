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
  mileage: any
  price: any
  sold: boolean
  buyer: string

  constructor(
    _owner: string,
    _tokenId: number,
    _licensePlate: string,
    _chassisNumber: string,
    _brand: string,
    _carType: string,
    _colour: string,
    _mileage: number,
    _price: number,
    _sold: boolean,
    _buyer: string
  ) {
    this.owner = _owner
    this.tokenId = _tokenId
    this.licensePlate = _licensePlate
    this.chassisNumber = _chassisNumber
    this.brand = _brand
    this.carType = _carType
    this.colour = _colour
    this.mileage = _mileage
    this.price = _price
    this.sold = _sold
    this.buyer = _buyer
  }

  /**
   * Create a new Car object from an array of properties
   * @param {Array} item - An array of properties representing a car
   * @returns {Car} A new Car object with the given properties
   */
  static fromArray(item: Car): Car {
    return new Car(
      item['owner'],
      this.hexConverter(item['tokenId']['_hex']),
      item['licensePlate'],
      item['chassisNumber'],
      item['brand'],
      item['carType'],
      item['colour'],
      this.hexConverter(item['price']['_hex']),
      this.hexConverter(item['mileage']['_hex']),
      item['sold'],
      item['buyer']
    )
  }

  /**
   * Converts a hexadecimal string to a decimal number.
   *
   * @param hex - A hexadecimal string.
   * @returns A decimal number.
   */
  static hexConverter(hex: string) {
    return parseInt(hex, 16)
  }
}
