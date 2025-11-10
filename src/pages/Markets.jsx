import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, TrendingUp, TrendingDown, Clock, Users } from 'lucide-react';
import { useMarkets } from '../contexts/MarketContext';

const Markets = () => {
    // Correctly consume the markets array from the context
    const { markets: allMarkets } = useMarkets();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, setSortBy] = useState('volume');

    // Add useEffect to clear filters on component mount/initial navigation
    useEffect(() => {
        setSearchTerm('');
        setFilterCategory('all');
        setSortBy('volume');
    }, []);

    // Helper function to safely get numeric values for sorting/filtering
    const getNumericValue = (market, key) => {
        // Safely return 0 if the value is null, undefined, or 0.
        return market[key] || 0;
    };

    // FIX: Use useMemo to recalculate filteredMarkets ONLY when allMarkets or filters change.
    const filteredMarkets = useMemo(() => {
        let currentMarkets = allMarkets;

        // 1. Search Filter
        currentMarkets = currentMarkets.filter(market => {
            const searchLower = searchTerm.toLowerCase();
            const companyMatch = (market.company || '').toLowerCase().includes(searchLower);
            const bondIdMatch = (market.bondId || '').toLowerCase().includes(searchLower);
            return companyMatch || bondIdMatch;
        });

        // 2. Category Filter
        currentMarkets = currentMarkets.filter(market => {
            return filterCategory === 'all' ||
                (market.category && market.category === filterCategory);
        });

        // 3. Sort Logic
        return currentMarkets.sort((a, b) => {
            switch (sortBy) {
                case 'volume':
                    return getNumericValue(b, 'volumeRaw') - getNumericValue(a, 'volumeRaw');
                case 'participants':
                    return getNumericValue(b, 'participants') - getNumericValue(a, 'participants');
                case 'deadline':
                    // **FINAL ROBUST FIX for deadline parsing:**
                    // Get time in milliseconds, defaulting to 0 if the date string is empty.
                    const timeA = new Date(a.deadline || '').getTime();
                    const timeB = new Date(b.deadline || '').getTime();

                    // If the time is invalid (NaN), treat it as Infinity to push it to the end of the ascending list.
                    const dateA = isNaN(timeA) ? Infinity : timeA;
                    const dateB = isNaN(timeB) ? Infinity : timeB;

                    return dateA - dateB;
                default:
                    return 0;
            }
        });
    }, [allMarkets, searchTerm, filterCategory, sortBy]); // Dependencies: Recalculate when any of these change.

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'technology', label: 'Technology' },
        { value: 'automotive', label: 'Automotive' },
        { value: 'entertainment', label: 'Entertainment' },
        { value: 'retail', label: 'Retail' },
        { value: 'real-estate', label: 'Real Estate' },
        { value: 'travel', label: 'Travel & Hospitality' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Prediction Markets</h1>
                    <p className="text-gray-600">Discover and trade on corporate bond default predictions</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search companies or bonds..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            >
                                {categories.map(category => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="volume">Sort by Volume</option>
                            <option value="participants">Sort by Participants</option>
                            <option value="deadline">Sort by Deadline</option>
                        </select>
                    </div>
                </div>

                {/* Markets Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredMarkets.map((market) => (
                        <div
                            key={market.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden"
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">{market.company}</h3>
                                        {/* Use tickerSymbol if bondId is empty */}
                                        <p className="text-sm text-gray-500">{market.bondId || market.tickerSymbol}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {market.trend === 'up' ? (
                                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <TrendingDown className="w-5 h-5 text-red-500" />
                                        )}
                                    </div>
                                </div>

                                {/* Question */}
                                <p className="text-gray-700 mb-6 text-sm leading-relaxed">{market.question}</p>

                                {/* Prices - Use sensible defaults if prices aren't set yet */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                                        <div className="text-lg font-bold text-red-600">
                                            {market.yesPrice ? `${(market.yesPrice * 100).toFixed(0)}¢` : '50¢'}
                                        </div>
                                        <div className="text-xs text-red-700 font-medium">YES</div>
                                    </div>
                                    <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                        <div className="text-lg font-bold text-emerald-600">
                                            {market.noPrice ? `${(market.noPrice * 100).toFixed(0)}¢` : '50¢'}
                                        </div>
                                        <div className="text-xs text-emerald-700 font-medium">NO</div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">{market.volume || '$0'}</div>
                                        <div className="text-xs text-gray-500">Volume</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900 flex items-center justify-center">
                                            <Users className="w-3 h-3 mr-1" />
                                            {market.participants || 0}
                                        </div>
                                        <div className="text-xs text-gray-500">Traders</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900 flex items-center justify-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {/* Safely calculate days remaining */}
                                            {market.deadline ?
                                                (() => {
                                                    const daysLeft = Math.ceil((new Date(market.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                                    return daysLeft > 0 ? `${daysLeft}d` : 'Ended';
                                                })()
                                                : 'N/A'
                                            }
                                        </div>
                                        <div className="text-xs text-gray-500">Remaining</div>
                                    </div>
                                </div>

                                {/* Trade Button */}
                                <Link
                                    to={`/market/${market.id}`}
                                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center block font-medium"
                                >
                                    Trade Now
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredMarkets.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Search className="w-12 h-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No markets found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Markets;