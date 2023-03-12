import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

import CONTRACT_ABI from '../../contract/build/contracts/CarDealership.json'
const CONTRACT_ADDRESS = process.env.DEALERSHIP_CONTRACT!

export default function useContract() {
  const [contract, setContract] = useState<any>(null)
  const [provider, setProvider] = useState<any>(null)

  useEffect(() => {
    async function connectToContract() {
      try {
        const _provider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(provider)

        const signer = _provider.getSigner()

        const _contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI.abi,
          signer
        )
        setContract(_contract)
      } catch (error) {
        console.error(error)
      }
    }

    connectToContract()
    // eslint-disable-next-line
  }, [])

  async function callContractFunction(functionName: string, args: any[] = []) {
    if (!contract) {
      console.error('Contract not yet connected')
      return
    }

    try {
      const result = await contract[functionName](...args)
      return result
    } catch (error) {
      console.error(error)
    }
  }

  return { provider, contract, callContractFunction }
}
