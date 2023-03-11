import { createContext, useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'

// TODO: Add support for dynamic contracts
import abi from '../../contract/build/contracts/CarDealership.json'
const contractAddress = process.env.DEALERSHIP_CONTRACT!

interface WalletContextInterface {
  isConnected: boolean
  address: string | null
  callContractFunction: (functionName: string, ...args: any[]) => Promise<any>
  callContractFunctionWithEthers: (
    functionName: string,
    value: ethers.BigNumberish,
    ...args: any[]
  ) => Promise<any>
  connectToContract: () => Promise<void>
  connectWallet: () => Promise<void>
}

const WalletContext = createContext<WalletContextInterface>({
  isConnected: false,
  address: null,
  callContractFunction: async (functionName: string, ...args: any[]) => {},
  callContractFunctionWithEthers: async (functionName, value, ...args) => {},
  connectToContract: async () => {},
  connectWallet: async () => {},
})

interface Props {
  children: React.ReactNode
}

export function WalletProvider({ children }: Props) {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(
    null
  )
  const [address, setAddress] = useState<string | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)

  useEffect(() => {
    connectToContract()
    // eslint-disable-next-line
  }, [])

  async function connectToContract(): Promise<void> {
    try {
      if (typeof (window as any) === 'undefined') {
        throw new Error('Please install MetaMask first.')
      }

      const _provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      )
      const _signer = _provider.getSigner()
      const _contract = new ethers.Contract(contractAddress, abi.abi, _signer)

      const _address = await _provider.listAccounts()

      if (_address.length > 0) {
        setAddress(_address[0])
      }

      setProvider(_provider)
      setSigner(_signer)
      setContract(_contract)

      setIsConnected(true)
    } catch (err) {
      console.error(err)
    }
  }

  async function connectWallet(): Promise<void> {
    try {
      if (typeof (window as any) === 'undefined') {
        throw new Error('Please install MetaMask first.')
      }

      await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      })

      const _address = await signer!.getAddress()
      setAddress(_address)
    } catch (err) {
      console.error(err)
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

  async function callContractFunctionWithEthers(
    functionName: any,
    value: ethers.BigNumberish,
    ...args: any[]
  ) {
    try {
      if (!contract) {
        console.error('Contract not initialized')
        return null
      }

      const tx = await contract.functions[functionName](...args, { value })
      const receipt = await tx.wait()
      return receipt
    } catch (error) {
      console.error(`Error calling function ${functionName}: ${error}`)
      return null
    }
  }

  // TODO: Add authentication guard
  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        callContractFunction,
        callContractFunctionWithEthers,
        connectToContract,
        connectWallet,
      }}
    >
      {isConnected ? children : <p>Loading</p>}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}
