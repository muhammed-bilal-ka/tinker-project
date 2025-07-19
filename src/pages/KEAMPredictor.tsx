import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, TrendingUp, Target, Award, ArrowRight } from 'lucide-react';
import { keamService } from '../lib/supabase';

const KEAMPredictor = () => {
  const navigate = useNavigate();
  const [keamRank, setKeamRank] = useState('');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'General',
    'OBC',
    'SC',
    'ST',
    'EWS',
    'PH'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keamRank || !category) {
      setError('Please fill in all fields');
      return;
    }

    const rank = parseInt(keamRank);
    if (isNaN(rank) || rank <= 0) {
      setError('Please enter a valid KEAM rank');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: prediction, error: predictionError } = await keamService.predictColleges(rank, category);
      
      if (predictionError) {
        setError('Failed to generate prediction. Please try again.');
        return;
      }

      // Store prediction in sessionStorage for the results page
      sessionStorage.setItem('keamPrediction', JSON.stringify({
        rank: rank,
        category: category,
        prediction: prediction,
        timestamp: new Date().toISOString()
      }));

      // Redirect to results page
      navigate('/keam-results');

    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-12 h-12 text-[#2563EB] mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">KEAM College Predictor</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get AI-powered predictions for your college admissions based on your KEAM rank and category. 
            Our algorithm analyzes historical data to provide accurate recommendations.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 text-center">
            <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Historical Analysis</h3>
            <p className="text-gray-600">Based on 4 years of KEAM rank data and trends</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 text-center">
            <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Accurate Predictions</h3>
            <p className="text-gray-600">AI-powered algorithm with confidence scoring</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 text-center">
            <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Results</h3>
            <p className="text-gray-600">High, medium, and low chance colleges with courses</p>
          </div>
        </div>

        {/* Prediction Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Enter Your Details
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="keamRank" className="block text-sm font-medium text-gray-700 mb-2">
                Your KEAM Rank *
              </label>
              <input
                type="number"
                id="keamRank"
                value={keamRank}
                onChange={(e) => setKeamRank(e.target.value)}
                placeholder="Enter your KEAM rank (e.g., 1500)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                min="1"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter your actual KEAM rank from the official results
              </p>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Select your reservation category as per KEAM guidelines
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Analyzes historical KEAM rank data from the last 4 years</li>
                <li>• Considers trends and patterns in rank cutoffs</li>
                <li>• Provides confidence scores for each prediction</li>
                <li>• Categorizes colleges into High, Medium, and Low chance</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] text-white py-3 px-6 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Predictions...
                </>
              ) : (
                <>
                  Get Predictions
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> This prediction is based on historical data analysis only. 
              Actual cutoffs may vary due to various factors including number of applicants, 
              changes in reservation policies, and other unforeseen circumstances. 
              Please use this as a reference and always verify with official sources.
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About KEAM</h3>
            <p className="text-gray-600 mb-4">
              Kerala Engineering Architecture Medical (KEAM) is the entrance examination for admission 
              to professional degree courses in Kerala. The exam is conducted by the Commissioner for 
              Entrance Examinations (CEE).
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Engineering courses in Government and Self-financing colleges</li>
              <li>• Architecture courses</li>
              <li>• Medical and Allied courses</li>
              <li>• Various reservation categories available</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Categories</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">High Chance (90%+)</p>
                  <p className="text-sm text-gray-600">Very likely to get admission</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">Medium Chance (50-90%)</p>
                  <p className="text-sm text-gray-600">Moderate chance of admission</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">Low Chance (&lt;50%)</p>
                  <p className="text-sm text-gray-600">Less likely but possible</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KEAMPredictor;