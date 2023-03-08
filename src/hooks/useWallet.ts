import { useState, useEffect } from 'react'
import { Wallet, ethers } from 'ethers'

type returnProps = {
  wallet: ethers.Signer | null
  connectWallet: () => Promise<void>
  getAddress: () => Promise<string>
  getWallet: () => Promise<ethers.Signer | null>
}

const useWallet = (): returnProps => {
  const [wallet, setWallet] = useState<ethers.Signer | null>(null)

  useEffect(() => {
    const getWallet = async () => {
      if (!window.ethereum) {
        throw new Error('No Web3 available')
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)

      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const _wallet = provider.getSigner()
        setWallet(_wallet)
      } catch (err) {
        console.error('User denied account access')
      }
    }

    getWallet()
  }, [])

  const connectWallet = async (): Promise<void> => {
    if (!window.ethereum) {
      throw new Error('No Web3 available')
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const _wallet = provider.getSigner()
      setWallet(_wallet)
    } catch (err) {
      console.error('User denied account access')
    }
  }

  const getAddress = async (): Promise<string> => {
    let addres = 'none'

    if (wallet !== null) {
      addres = await wallet.getAddress()
    }

    return addres
  }

  const getWallet = async (): Promise<ethers.Signer | null> => {
    if (!window.ethereum) {
      throw new Error('No Web3 available')
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const _wallet = provider.getSigner()

      return _wallet
    } catch (err) {
      console.error('User denied account access')
    }

    return null
  }

  return { wallet, connectWallet, getAddress, getWallet }
}

export default useWallet
