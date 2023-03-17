import BigNumber from 'bignumber.js'

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
  metadataUri: string
  forSale: boolean

  static BRAND: string[] = [
    'Volkswagen',
    'BMW',
    'Opel',
    'Mercedes-Benz',
    'Audi',
    'Renault',
    'Peugeot',
    'Ford',
    'Volvo',
    'Fiat',
    'Citroën',
    'Seat',
    'Toyota',
  ]

  static TYPE: string[] = [
    'Cabriolet',
    'Coupé',
    'Hatchback',
    'MPV',
    'Sedan',
    'Stationwagon',
    'SUV of ATV',
    'Overig',
  ]

  static COLOUR: string[] = [
    'Blue',
    'Red',
    'Silver or Grey',
    'Black',
    'Beige',
    'Brown',
    'Green',
    'White',
    'Other colours',
  ]

  static DEFAULT = new Car(
    '',
    0,
    '00-AAA-0',
    '123456789',
    Car.BRAND[0],
    Car.TYPE[0],
    Car.COLOUR[0],
    1,
    1,
    false,
    '',
    '',
    false
  )

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
    _buyer: string,
    _metadataUri: string,
    _forSale: boolean
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
    this.metadataUri = _metadataUri
    this.forSale = _forSale
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
      this.hexConverter(item['mileage']['_hex']),
      this.hexConverter(item['price']['_hex']),
      item['sold'],
      item['buyer'],
      item['metadataUri'],
      item['forSale']
    )
  }

  /**
   * Converts a hexadecimal string to a decimal number.
   *
   * @param hex - A hexadecimal string.
   * @returns A decimal number.
   */
  static hexConverter(hex: string) {
    return new BigNumber(hex).toNumber()
  }
}
