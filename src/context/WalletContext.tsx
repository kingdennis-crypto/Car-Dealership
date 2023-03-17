import { createContext, useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'

// TODO: Add support for dynamic contracts
import abi from '../../contract/build/contracts/CarDealership.json'
const contractAddress = process.env.DEALERSHIP_CONTRACT!

/**
 * Interface for the WalletContext object that will be created
 */
interface WalletContextInterface {
  isConnected: boolean
  address: string | null
  provider: any
  callContractFunction: (functionName: string, ...args: any[]) => Promise<any>
  callContractFunctionWithEthers: (
    functionName: string,
    value: ethers.BigNumberish,
    ...args: any[]
  ) => Promise<any>
  connectToContract: () => Promise<void>
  connectWallet: () => Promise<void>
  dealership: string
}

/**
 * WalletContext object that will be used by the child components
 */
const WalletContext = createContext<WalletContextInterface>({
  isConnected: false,
  address: null,
  provider: null,
  callContractFunction: async (functionName: string, ...args: any[]) => {},
  callContractFunctionWithEthers: async (functionName, value, ...args) => {},
  connectToContract: async () => {},
  connectWallet: async () => {},
  dealership: '',
})

/**
 * Props interface for the WalletProvider component
 */
interface Props {
  children: React.ReactNode
}

/**
 * WalletProvider component that will provide the WalletContext to child components
 */
export function WalletProvider({ children }: Props) {
  // const [dealerships, setDealerships] = useState<string[]>([
  //   '0xf09A5CF83D522Fcfa525823Ad8e4c5b533F1B434',
  // ])
  const dealership = '0xf09A5CF83D522Fcfa525823Ad8e4c5b533F1B434'
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(
    null
  )
  const [address, setAddress] = useState<string | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)

  /**
   * Connect to the contract when the component is mounted
   */
  useEffect(() => {
    connectToContract()
    // eslint-disable-next-line
  }, [])

  /**
   * Connects to a contract and sets the provider, signer, contract, and address if successful.
   * @async
   * @function connectToContract
   * @return {Promise<void>} Promise that resolves when connection is successful.
   * @throws {Error} If MetaMask is not installed.
   * @throws {Error} If connection to the contract is unsuccessful.
   */
  async function connectToContract(): Promise<void> {
    try {
      // Check if MetaMask is installed
      if (typeof (window as any) === 'undefined') {
        throw new Error('Please install MetaMask first.')
      }

      // Connect to Web3Provider using MetaMask
      const _provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      )

      const _signer = _provider.getSigner()
      const _contract = new ethers.Contract(contractAddress, abi.abi, _signer)

      const _address = await _provider.listAccounts()

      if (_address.length > 0) {
        setAddress(_address[0])
      }

      // Set the provider, signer, and contract
      setProvider(_provider)
      setSigner(_signer)
      setContract(_contract)

      const ethereuem = (window as any).ethereum

      // Add event listener for account changes
      ethereuem.on('accountsChanged', (_accounts: any) => {
        setAddress(_accounts.length > 0 ? _accounts[0] : null)
      })

      setIsConnected(true)
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Connects to the user's MetaMask wallet and sets the address if successful.
   * @async
   * @function connectWallet
   * @returns {Promise<void>} Promise that resolves when connection is succesful.
   * @throws {Error} If MetaMask is not installed.
   * @throws {Error} If connection to the wallet is unsuccessful.
   */
  async function connectWallet(): Promise<void> {
    try {
      // Check if MetaMask is installed
      if (typeof (window as any) === 'undefined') {
        throw new Error('Please install MetaMask first.')
      }

      // Request access to the user's MetaMask account
      await(window as any).ethereum.request({
        method: 'eth_requestAccounts',
      })

      // Set the address if signer exists
      if (signer !== null) {
        const _address = await signer!.getAddress()
        setAddress(_address)
      }
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Calls a function of the intiailized contract with the specified function name and arguments.
   * @async
   * @function callContractFunction
   * @param {string} functionName - The name of the function to call.
   * @param {...any[]} args - The arguments to pass to the function.
   * @returns {Promise<any>} Promise that resolves with the result of the function call, or numm if unsuccessful.
   * @throws {Error} If the contract is not initialized.
   * @throws {Error} If the function call is unsuccessfull.
   */
  async function callContractFunction(
    functionName: string,
    ...args: any[]
  ): Promise<any> {
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

  /**
   * Calls a function of the initialized contract with the specified function name and arguments along with the specified value in ether.
   * @async
   * @function callContractFunctionWithEthers
   * @param {string} functionName - The name of the function to call.
   * @param {ethers.BigNumber} value - The value to send with the function call, in ether.
   * @param {...any[]} args - The arguments to pass to the function.
   * @returns {Promise<ethers.providers.TransactionReceipt | null>} Promise that resolves with the transaction receipt of the function call, or null if unsuccessful.
   * @throws {Error} If the contract is not initialized.
   * @throws {Error} If the function call is unsuccessful.
   */
  async function callContractFunctionWithEthers(
    functionName: string,
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

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        provider,
        callContractFunction,
        callContractFunctionWithEthers,
        connectToContract,
        connectWallet,
        dealership,
      }}
    >
      {isConnected ? children : <p>Loading</p>}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}
