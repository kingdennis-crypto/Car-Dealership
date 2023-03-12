import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

// TODO: Add loading variable and a timeout timer for if contract is not loadable
export default function useEthers(contractAddress: any, contractAbi: any) {
  const [ethersProvider, setEthersProvider] = useState<any>(null)
  const [userAddress, setUserAddress] = useState<any>(null)
  const [contract, setContract] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const checkUserSignIn = async () => {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('No Web3 provider')
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)

      setEthersProvider(provider)

      const signer = provider.getSigner()
      const address = await signer.getAddress()
      setUserAddress(address)

      const contract = new ethers.Contract(contractAddress, contractAbi, signer)
      setContract(contract)
    }

    checkUserSignIn()
  }, [contractAddress, contractAbi])

  async function callContractFunction(functionName: any, ...args: any[]) {
    try {
      if (!contract) {
        console.error('Contract not initialized')
        return null
      }

      const result = await contract[functionName](...args)
      return result
    } catch (error) {
      console.error(`Error calling function ${functionName}: ${error}`)
      return null
    }
  }

  return { ethersProvider, userAddress, contract, callContractFunction }
}
