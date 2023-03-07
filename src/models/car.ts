export default class Car {
  owner: string
  licensePlate: string
  chassisNumber: number
  brand: string
  carType: string
  colour: string
  mileage: number
  imageUrl: string

  constructor(
    _owner: string,
    _licensePlate: string,
    _chassisNumber: number,
    _brand: string,
    _carType: string,
    _colour: string,
    _mileage: number,
    _imageUrl: string
  ) {
    this.owner = _owner
    this.licensePlate = _licensePlate
    this.chassisNumber = _chassisNumber
    this.brand = _brand
    this.carType = _carType
    this.colour = _colour
    this.mileage = _mileage
    this.imageUrl = _imageUrl
  }

  static fromArray(item: Car[]) {
    return new Car(
      item['owner'],
      item['licensePlate'],
      item['chassisNumber'],
      item['brand'],
      item['carType'],
      item['colour'],
      item['mileage'],
      item['imageUrl']
    )
  }

  static fromJson(item: Car) {
    return new Car(
      item.owner,
      item.licensePlate,
      item.chassisNumber,
      item.brand,
      item.carType,
      item.colour,
      item.mileage,
      item.imageUrl
    )
  }
}
