import { createContext, useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'

// TODO: Add support for dynamic contracts
import abi from '../../contract/build/contracts/CarDealership.json'
const contractAddress = process.env.DEALERSHIP_CONTRACT!

interface WalletContextInterface {
  isConnected: boolean
  address: string | null
  callContractFunction: (functionName: string, ...args: any[]) => Promise<any>
  connect: () => Promise<void>
}

const WalletContext = createContext<WalletContextInterface>({
  isConnected: false,
  address: null,
  callContractFunction: async (functionName: string, ...args: any[]) => {},
  connect: async () => {},
})

interface Props {
  children: React.ReactNode
}

export function WalletProvider({ children }: Props) {
  const [provider, setProvider] = useState<any>(null)
  const [signer, setSigner] = useState<any>(null)
  const [address, setAddress] = useState<any>(null)
  const [contract, setContract] = useState<any>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)

  useEffect(() => {
    connect()
    // eslint-disable-next-line
  }, [])

  // TODO: Add function to not immediately login

  // async function getConnectedWallet() {
  //   if (typeof (window as any).ethereum === 'undefined') {
  //     throw new Error('Please install MetaMask first.');
  //   }

  //   const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  //   const accounts = await provider.listAccounts();

  //   if (accounts.length === 0) {
  //     return login();
  //   }

  //   return accounts[0];
  // }

  // async function login() {
  //   if (typeof (window as any).ethereum === 'undefined') {
  //     throw new Error('Please install MetaMask first.');
  //   }
  // }

  async function connect(): Promise<void> {
    try {
      if (typeof (window as any) === 'undefined') {
        throw new Error('Please install MetaMask first.')
      }

      await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      })

      const _provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      )
      const _signer = _provider.getSigner()
      const _address = await _signer.getAddress()
      const _contract = new ethers.Contract(contractAddress, abi.abi, _signer)

      setProvider(_provider)
      setAddress(_address)
      setContract(_contract)

      setIsConnected(true)
    } catch (error) {
      console.log(error)
    }
  }

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

  // TODO: Add authentication guard
  return (
    <WalletContext.Provider
      value={{ isConnected, address, callContractFunction, connect }}
    >
      {isConnected ? children : <p>Loading</p>}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}
