import BigNumber from 'bignumber.js'

export default class Mileage {
  token: any
  mileage: any
  date: any

  constructor(_token: number, _mileage: number, _date: Date) {
    this.token = _token
    this.mileage = _mileage
    this.date = _date
  }

  static fromArray(item: Mileage): Mileage {
    return new Mileage(
      this.hexConverter(item['token']['_hex']),
      this.hexConverter(item['mileage']['_hex']),
      new Date(this.hexConverter(item['date']['_hex']))
    )
  }

  /**
   * Converts a hexadecimal string to a decimal number.
   *
   * @param hex - A hexadecimal string.
   * @returns A decimal number.
   */
  static hexConverter(hex: string): number {
    return new BigNumber(hex).toNumber()
  }
}
