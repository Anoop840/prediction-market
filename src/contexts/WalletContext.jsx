import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import { useToast } from './ToastContext';
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
    const { showToast } = useToast();

    // Detect any injected Ethereum provider (MetaMask or other wallets)
    const isMetaMaskAvailable = () => typeof window !== 'undefined' && Boolean(window.ethereum);

    // NEW: Function to handle when accounts change
    const handleAccountsChanged = async (accounts) => {
        if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            if (typeof fetchBalance === 'function') {
                await fetchBalance(accounts[0]);
            }
        } else {
            // Disconnect if all accounts are removed
            disconnectWallet();
        }
    };

    // NEW: Function to handle when the network chain changes
    const handleChainChanged = (chainId) => {
        console.warn('Network changed. Please refresh or reconnect.');
        disconnectWallet();
    };

    const fetchBalance = useCallback(async (address) => {
        if (isMetaMaskAvailable()) {
            try {
                // Assuming you installed ethers@5, this syntax works.
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const balanceWei = await provider.getBalance(address);
                const balanceEth = ethers.utils.formatEther(balanceWei);
                setBalance(balanceEth);
            } catch (error) {
                console.error('Failed to fetch balance:', error);
                setBalance('0.00');
            }
        }
    }, []); // Removed dependency array item for now to avoid re-creation issues

    const connectWallet = async () => {
        if (isMetaMaskAvailable()) {
            try {
                setIsConnecting(true);
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts && accounts.length > 0) {
                    setAccount(accounts[0]);
                    await fetchBalance(accounts[0]);
                    showToast('success', 'Wallet successfully connected!');
                }
            } catch (error) {
                console.error('Failed to connect wallet:', error);
                showToast('error', 'Connection rejected or failed. Please check your wallet.');
            } finally {
                setIsConnecting(false);
            }
        } else {
            showToast('info', 'MetaMask not detected. Please install it to connect your wallet.');
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setBalance('0.00');
    };

    useEffect(() => {
        // We REMOVE the initial checkConnection() call here to prevent auto-connect.

        const ethereum = window.ethereum;
        // 2. NEW: Add event listeners for continuous connection tracking
        if (ethereum && ethereum.on) {
            ethereum.on('accountsChanged', handleAccountsChanged);
            ethereum.on('chainChanged', handleChainChanged);

            // OPTIONAL: Immediately check for existing accounts *after* setting listeners
            // If you still want the auto-login feature without forcing a connection popup:
            const checkInitialAccounts = async () => {
                const accounts = await ethereum.request({ method: 'eth_accounts' });
                if (accounts && accounts.length > 0) {
                    setAccount(accounts[0]);
                    await fetchBalance(accounts[0]);
                }
            };
            checkInitialAccounts();
        }

        // 3. Cleanup function to remove listeners when the component unmounts
        return () => {
            if (ethereum && ethereum.removeListener) {
                ethereum.removeListener('accountsChanged', handleAccountsChanged);
                ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, [fetchBalance]); // IMPORTANT: Changed dependency array to empty []

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