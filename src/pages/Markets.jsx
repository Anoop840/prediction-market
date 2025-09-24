import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, TrendingUp, TrendingDown, Clock, Users } from 'lucide-react';

const Markets = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, setSortBy] = useState('volume');

    const markets = [
        {
            id: 1,
            company: 'Tesla Inc.',
            bondId: 'TSLA-2027-5.3%',
            question: 'Will Tesla default on its 2027 bond before maturity?',
            yesPrice: 0.23,
            noPrice: 0.77,
            volume: '$45,230',
            volumeRaw: 45230,
            deadline: '2025-12-31',
            participants: 127,
            category: 'automotive',
            trend: 'up'
        },
        {
            id: 2,
            company: 'WeWork Inc.',
            bondId: 'WE-2026-7.875%',
            question: 'Will WeWork default on its 2026 bond before maturity?',
            yesPrice: 0.68,
            noPrice: 0.32,
            volume: '$32,150',
            volumeRaw: 32150,
            deadline: '2026-08-15',
            participants: 89,
            category: 'real-estate',
            trend: 'down'
        },
        {
            id: 3,
            company: 'AMC Entertainment',
            bondId: 'AMC-2025-10.5%',
            question: 'Will AMC default on its 2025 bond before maturity?',
            yesPrice: 0.45,
            noPrice: 0.55,
            volume: '$28,940',
            volumeRaw: 28940,
            deadline: '2025-06-30',
            participants: 156,
            category: 'entertainment',
            trend: 'up'
        },
        {
            id: 4,
            company: 'Bed Bath & Beyond',
            bondId: 'BBBY-2024-4.915%',
            question: 'Will Bed Bath & Beyond default on its 2024 bond before maturity?',
            yesPrice: 0.89,
            noPrice: 0.11,
            volume: '$67,820',
            volumeRaw: 67820,
            deadline: '2024-08-01',
            participants: 203,
            category: 'retail',
            trend: 'up'
        },
        {
            id: 5,
            company: 'Zoom Communications',
            bondId: 'ZM-2028-0.375%',
            question: 'Will Zoom default on its 2028 bond before maturity?',
            yesPrice: 0.08,
            noPrice: 0.92,
            volume: '$19,560',
            volumeRaw: 19560,
            deadline: '2028-02-01',
            participants: 74,
            category: 'technology',
            trend: 'down'
        },
        {
            id: 6,
            company: 'Norwegian Cruise Line',
            bondId: 'NCLH-2025-12.25%',
            question: 'Will Norwegian Cruise Line default on its 2025 bond before maturity?',
            yesPrice: 0.34,
            noPrice: 0.66,
            volume: '$41,780',
            volumeRaw: 41780,
            deadline: '2025-10-15',
            participants: 118,
            category: 'travel',
            trend: 'up'
        }
    ];

    const filteredMarkets = markets
        .filter(market =>
            market.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            market.bondId.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(market => filterCategory === 'all' || market.category === filterCategory)
        .sort((a, b) => {
            switch (sortBy) {
                case 'volume':
                    return b.volumeRaw - a.volumeRaw;
                case 'participants':
                    return b.participants - a.participants;
                case 'deadline':
                    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                default:
                    return 0;
            }
        });

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
                                        <p className="text-sm text-gray-500">{market.bondId}</p>
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

                                {/* Prices */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                                        <div className="text-lg font-bold text-red-600">{(market.yesPrice * 100).toFixed(0)}¢</div>
                                        <div className="text-xs text-red-700 font-medium">YES</div>
                                    </div>
                                    <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                        <div className="text-lg font-bold text-emerald-600">{(market.noPrice * 100).toFixed(0)}¢</div>
                                        <div className="text-xs text-emerald-700 font-medium">NO</div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">{market.volume}</div>
                                        <div className="text-xs text-gray-500">Volume</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900 flex items-center justify-center">
                                            <Users className="w-3 h-3 mr-1" />
                                            {market.participants}
                                        </div>
                                        <div className="text-xs text-gray-500">Traders</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900 flex items-center justify-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {Math.ceil((new Date(market.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}d
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
