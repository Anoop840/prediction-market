import React, { createContext, useContext, useState, useEffect } from 'react';

const MarketContext = createContext();

export const useMarkets = () => {
    return useContext(MarketContext);
};

// Simple ID Generator function for mock data
const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

// Key used for localStorage
const LOCAL_STORAGE_KEY = 'bondPredictMarkets';

// --- Define initialMarkets as an empty array ---
const initialMarkets = [];
// ----------------------------------------------------

// Function to read the persisted state on load
const getInitialState = () => {
    // 1. Try to read from local storage
    try {
        const persistedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (persistedState) {
            // Return parsed persisted data if it exists
            return JSON.parse(persistedState);
        }
    } catch (e) {
        console.error("Could not load markets from local storage:", e);
    }
    // 2. Fallback to the empty hardcoded list
    return initialMarkets;
};


export const MarketProvider = ({ children }) => {
    // 1. Initialize state from local storage or fallback data
    const [markets, setMarkets] = useState(getInitialState);

    // 2. Persist state whenever the 'markets' array changes
    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(markets));
        } catch (e) {
            console.error("Could not save markets to local storage:", e);
        }
    }, [markets]);

    // Function to simulate adding a new market (like adding to a database)
    const addMarket = (newMarketData) => {

        // We create the core market object by combining defaults and user input.
        const newMarket = {

            // 1. Core user input fields become top-level properties.
            ...newMarketData, // <--- THIS SPREAD MUST BE FIRST OR LAST TO ENSURE OVERRIDE

            // 2. Calculated and Default Fields (Overrides user input if fields collide)
            id: generateUniqueId(),
            yesPrice: 0.5,
            noPrice: 0.5,
            volume: '$0',
            volumeRaw: 0,
            participants: 0,
            trend: 'up',

            // 3. Structured Data (Populated from the user input that is ALREADY spread)
            bondDetails: {
                // We use the newMarketData for the bondDetails structure, ensuring they are present
                issuer: newMarketData.companyName || 'N/A',
                coupon: newMarketData.couponRate || 'N/A',
                maturity: newMarketData.maturityDate || 'N/A',
                principal: newMarketData.faceValue || 'N/A',
                rating: newMarketData.creditRating || 'N/A',
                sector: newMarketData.sectorIndustry || 'N/A',
            },

        };

        setMarkets(prevMarkets => [newMarket, ...prevMarkets]);
    };

    return (
        <MarketContext.Provider value={{ markets, addMarket }}>
            {children}
        </MarketContext.Provider>
    );
};