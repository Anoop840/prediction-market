import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useCallback } from 'react';
const WalletContext = createContext();

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

export const WalletProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState('0.00');
    const [isConnecting, setIsConnecting] = useState(false);

    // Detect any injected Ethereum provider (MetaMask or other wallets)
    const isMetaMaskAvailable = () => typeof window !== 'undefined' && Boolean(window.ethereum);

    const fetchBalance = useCallback(async (address) => {
        if (isMetaMaskAvailable()) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const balanceWei = await provider.getBalance(address);
                const balanceEth = ethers.utils.formatEther(balanceWei);
                setBalance(balanceEth);
            } catch (error) {
                console.error('Failed to fetch balance:', error);
                setBalance('0.00');
            }
        }
    }, []);

    const connectWallet = async () => {
        if (isMetaMaskAvailable()) {
            try {
                setIsConnecting(true);
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts && accounts.length > 0) {
                    setAccount(accounts[0]);
                    await fetchBalance(accounts[0]);
                }
            } catch (error) {
                console.error('Failed to connect wallet:', error);
            } finally {
                setIsConnecting(false);
            }
        } else {
            // more friendly message and fallback link
            const install = window.confirm('MetaMask not detected in your browser. Would you like to open the MetaMask download page?');
            if (install) window.open('https://metamask.io/download.html', '_blank');
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setBalance('0.00');
    };

    useEffect(() => {
        // Check if wallet is already connected
        const checkConnection = async () => {
            if (isMetaMaskAvailable()) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts && accounts.length > 0) {
                        setAccount(accounts[0]);
                        await fetchBalance(accounts[0]);
                    }
                } catch (error) {
                    console.error('Failed to check wallet connection:', error);
                }
            }
        };

        checkConnection();
    }, [fetchBalance]);

    return (
        <WalletContext.Provider
            value={{
                account,
                balance,
                isConnecting,
                connectWallet,
                disconnectWallet,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};
