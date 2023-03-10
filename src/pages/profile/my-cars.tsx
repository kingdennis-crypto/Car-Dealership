import useWallet from '@/hooks/useWallet'

import useEthers from '@/hooks/useEthers'

import abi from '../../../contract/build/contracts/CarDealership.json'
import { useEffect } from 'react'
const address = process.env.DEALERSHIP_CONTRACT!

export default function MyCars() {
  const contract = useEthers(address, abi.abi)
  const wallet = useWallet()

  async function getCars() {
    const _owner = await wallet.getAddress()
    const _cars = await contract.callContractFunction('getCarsByOwner', _owner)
    // const _cars = await contract.callContractFunction('testFunction')
    console.log(_cars)
  }

  return (
    <div>
      <p>My Cars</p>
      <button onClick={getCars}>Load cars</button>
    </div>
  )
}
