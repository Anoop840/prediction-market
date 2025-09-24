import React, { useState } from 'react';
import { Calendar, Info, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../contexts/ToastContext';

const CreateMarket = () => {
    const { account } = useWallet();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        companyName: '',
        tickerSymbol: '',
        sectorIndustry: '',
        countryRegion: '',
        question: '',
        description: '',
        deadline: '',
        category: '',
        resolutionCriteria: [],
        bondId: '',
        bondType: '',
        issueDate: '',
        maturityDate: '',
        couponRate: '',
        faceValue: '',
        creditRating: ''
    });

    const [isCreating, setIsCreating] = useState(false);

    const categories = [
        { value: '', label: 'Select Category' },
        { value: 'technology', label: 'Technology' },
        { value: 'automotive', label: 'Automotive' },
        { value: 'entertainment', label: 'Entertainment' },
        { value: 'retail', label: 'Retail' },
        { value: 'real-estate', label: 'Real Estate' },
        { value: 'travel', label: 'Travel & Hospitality' },
        { value: 'energy', label: 'Energy' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'financial', label: 'Financial Services' }
    ];

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCheckboxChange = (criteria) => {
        setFormData(prevState => {
            const currentCriteria = [...prevState.resolutionCriteria];
            if (currentCriteria.includes(criteria)) {
                return {
                    ...prevState,
                    resolutionCriteria: currentCriteria.filter(item => item !== criteria)
                };
            } else {
                return {
                    ...prevState,
                    resolutionCriteria: [...currentCriteria, criteria]
                };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!account) {
            showToast('error', 'Please connect your wallet first');
            return;
        }

        // Validate required fields
        const requiredFields = ['companyName', 'tickerSymbol', 'sectorIndustry', 'countryRegion', 'question', 'deadline', 'category'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            showToast('error', 'Please fill in all required fields');
            return;
        }

        setIsCreating(true);

        // Simulate market creation
        setTimeout(() => {
            setIsCreating(false);
            showToast('success', 'Prediction market created successfully!');

            // Reset form
            setFormData({
                companyName: '',
                tickerSymbol: '',
                sectorIndustry: '',
                countryRegion: '',
                question: '',
                description: '',
                deadline: '',
                category: '',
                resolutionCriteria: [],
                bondId: '',
                bondType: '',
                issueDate: '',
                maturityDate: '',
                couponRate: '',
                faceValue: '',
                creditRating: ''
            });
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Prediction Market</h1>
                    <p className="text-gray-600">Set up a new market for corporate bond default predictions</p>
                </div>

                {/* Warning Box */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                    <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-amber-800 mb-1">Important Notice</h3>
                            <p className="text-sm text-amber-700">
                                Creating prediction markets requires careful consideration. Ensure all bond information is accurate
                                and verifiable. Markets cannot be modified once created and deployed to the blockchain.
                            </p>
                        </div>
                    </div>
                </div>

                {!account ? (
                    /* Connect Wallet Prompt */
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
                        <div className="text-gray-400 mb-6">
                            <DollarSign className="w-16 h-16 mx-auto" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
                        <p className="text-gray-600 mb-6">You need to connect your wallet to create prediction markets</p>
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Connect Wallet
                        </button>
                    </div>
                ) : (
                    /* Create Market Form */
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        {/* ... (rest of your form fields remain unchanged) ... */}

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
                            >
                                {isCreating ? 'Creating Market...' : 'Create Market (0.01 ETH)'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreateMarket;
