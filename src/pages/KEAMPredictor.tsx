import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, TrendingUp, Target, Info } from 'lucide-react';

const KEAMPredictor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rank: '',
    category: '',
    location: '',
    branch: ''
  });

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'obc', label: 'OBC' },
    { value: 'sc', label: 'SC' },
    { value: 'st', label: 'ST' },
    { value: 'ezhava', label: 'Ezhava' },
    { value: 'muslim', label: 'Muslim' },
    { value: 'latin', label: 'Latin Catholic' },
    { value: 'other', label: 'Other' }
  ];

  const locations = [
    { value: 'thiruvananthapuram', label: 'Thiruvananthapuram' },
    { value: 'kochi', label: 'Kochi' },
    { value: 'kozhikode', label: 'Kozhikode' },
    { value: 'thrissur', label: 'Thrissur' },
    { value: 'kottayam', label: 'Kottayam' },
    { value: 'kollam', label: 'Kollam' },
    { value: 'palakkad', label: 'Palakkad' },
    { value: 'anywhere', label: 'Anywhere in Kerala' }
  ];

  const branches = [
    { value: 'computer', label: 'Computer Science Engineering' },
    { value: 'electronics', label: 'Electronics & Communication' },
    { value: 'mechanical', label: 'Mechanical Engineering' },
    { value: 'civil', label: 'Civil Engineering' },
    { value: 'electrical', label: 'Electrical Engineering' },
    { value: 'chemical', label: 'Chemical Engineering' },
    { value: 'it', label: 'Information Technology' },
    { value: 'any', label: 'Any Branch' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store prediction data in localStorage or context
    localStorage.setItem('keamPredictionData', JSON.stringify(formData));
    navigate('/keam-results');
  };

  const isFormValid = formData.rank && formData.category && formData.location && formData.branch;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-[#2563EB] rounded-full p-4">
              <Calculator className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            KEAM Rank Predictor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get accurate predictions for engineering college admissions in Kerala based on your KEAM rank and preferences.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 text-center">
            <div className="bg-[#2563EB]/10 rounded-full p-3 w-fit mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-[#2563EB]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">95% Accuracy</h3>
            <p className="text-gray-600 text-sm">Our predictions are based on historical data and trends</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 text-center">
            <div className="bg-[#2563EB]/10 rounded-full p-3 w-fit mx-auto mb-4">
              <Target className="w-6 h-6 text-[#2563EB]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">50+ Colleges</h3>
            <p className="text-gray-600 text-sm">Comprehensive data from all engineering colleges in Kerala</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 text-center">
            <div className="bg-[#2563EB]/10 rounded-full p-3 w-fit mx-auto mb-4">
              <Info className="w-6 h-6 text-[#2563EB]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
            <p className="text-gray-600 text-sm">Updated with latest cutoff trends and admission data</p>
          </div>
        </div>

        {/* Prediction Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] p-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Enter Your Details</h2>
            <p className="text-white/90">Fill in your KEAM rank and preferences to get personalized predictions</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* KEAM Rank */}
            <div>
              <label htmlFor="rank" className="block text-sm font-medium text-gray-700 mb-2">
                KEAM Rank *
              </label>
              <input
                type="number"
                id="rank"
                name="rank"
                value={formData.rank}
                onChange={handleInputChange}
                placeholder="Enter your KEAM rank (e.g., 5000)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                required
                min="1"
                max="200000"
              />
              <p className="text-sm text-gray-500 mt-1">Enter your KEAM rank (1-200000)</p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                required
              >
                <option value="">Select your category</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Location *
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                required
              >
                <option value="">Select preferred location</option>
                {locations.map(location => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Branch */}
            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Branch *
              </label>
              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                required
              >
                <option value="">Select preferred branch</option>
                {branches.map(branch => (
                  <option key={branch.value} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`flex-1 px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  isFormValid
                    ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Calculator className="w-5 h-5" />
                <span>Get Predictions</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ rank: '', category: '', location: '', branch: '' })}
                className="flex-1 sm:flex-initial px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How It Works</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Data Analysis</p>
                <p>We analyze historical cutoff data from all engineering colleges in Kerala</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Trend Prediction</p>
                <p>Our algorithm considers current trends and admission patterns</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Personalized Results</p>
                <p>Get college suggestions based on your rank, category, and preferences</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Regular Updates</p>
                <p>Predictions are updated regularly with latest admission data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KEAMPredictor;