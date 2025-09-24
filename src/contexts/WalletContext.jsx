import React, { createContext, useContext, useState, useEffect } from 'react';

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

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                setIsConnecting(true);
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });

                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    // Mock balance for demo
                    setBalance('2.45');
                }
            } catch (error) {
                console.error('Failed to connect wallet:', error);
            } finally {
                setIsConnecting(false);
            }
        } else {
            alert('Please install MetaMask to use this application');
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setBalance('0.00');
    };

    useEffect(() => {
        // Check if wallet is already connected
        const checkConnection = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const accounts = await window.ethereum.request({
                        method: 'eth_accounts',
                    });
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        setBalance('2.45');
                    }
                } catch (error) {
                    console.error('Failed to check wallet connection:', error);
                }
            }
        };

        checkConnection();
    }, []);

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
