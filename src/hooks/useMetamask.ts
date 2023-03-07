import { useState, useEffect } from 'react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function useMetaMask() {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [account, setAccount] = useState<string>('');

  useEffect(() => {
    const { ethereum } = window;

    if (!ethereum) {
      console.error("MetaMask is not installed.");
      return;
    }

    ethereum.autoRefreshOnNetworkChange = false;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount('');
      } else {
        setAccount(accounts[0]);
      }
    }

    ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  }, []);

  const loginWithMetamask = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.error("MetaMask is not installed.");
      return;
    }

    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const getConnectedAccounts = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.error("MetaMask is not installed.");
      return;
    }

    try {
      const accounts = await ethereum.request({
        method: 'eth_accounts',
      });

      if (accounts.length === 0) {
        setAccount('');
      } else {
        setAccount(accounts[0]);
      }

      return accounts[0];
    } catch (error) {
      console.error(error);
    }
  };

  return { account, loginWithMetamask, getConnectedAccounts };
}
