import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, TrendingUp, TrendingDown, Minus, 
  Building2, GraduationCap, Target, Download,
  Share2, RefreshCw, AlertTriangle
} from 'lucide-react';

interface PredictionResult {
  rank: number;
  category: string;
  prediction: {
    high_chance: Array<{
      college_name: string;
      course_name: string;
      category: string;
      confidence: number;
    }>;
    medium_chance: Array<{
      college_name: string;
      course_name: string;
      category: string;
      confidence: number;
    }>;
    low_chance: Array<{
      college_name: string;
      course_name: string;
      category: string;
      confidence: number;
    }>;
  };
  timestamp: string;
}

const KEAMResults = () => {
  const navigate = useNavigate();
  const [predictionData, setPredictionData] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedPrediction = sessionStorage.getItem('keamPrediction');
    
    if (!storedPrediction) {
      setError('No prediction data found. Please go back and generate a new prediction.');
      setLoading(false);
      return;
    }

    try {
      const data = JSON.parse(storedPrediction);
      setPredictionData(data);
    } catch (err) {
      setError('Invalid prediction data. Please generate a new prediction.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNewPrediction = () => {
    sessionStorage.removeItem('keamPrediction');
    navigate('/keam-predictor');
  };

  const handleDownloadResults = () => {
    if (!predictionData) return;

    const dataStr = JSON.stringify(predictionData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `keam-prediction-${predictionData.rank}-${predictionData.category}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShareResults = () => {
    if (!predictionData) return;

    const shareText = `My KEAM Rank: ${predictionData.rank} (${predictionData.category})\n\nHigh Chance Colleges: ${predictionData.prediction.high_chance.length}\nMedium Chance Colleges: ${predictionData.prediction.medium_chance.length}\nLow Chance Colleges: ${predictionData.prediction.low_chance.length}\n\nGenerated on SeekGram KEAM Predictor`;

    if (navigator.share) {
      navigator.share({
        title: 'My KEAM Prediction Results',
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Results copied to clipboard!');
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading your results...</h3>
            <p className="text-gray-600">Analyzing your KEAM rank and generating predictions.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !predictionData) {
    return (
      <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Results</h3>
            <p className="text-gray-600 mb-6">{error || 'Failed to load prediction results'}</p>
            <button
              onClick={handleNewPrediction}
              className="bg-[#2563EB] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200"
            >
              Generate New Prediction
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { rank, category, prediction, timestamp } = predictionData;

  return (
    <div className="min-h-screen py-6 sm:py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
            <button
              onClick={() => navigate('/keam-predictor')}
              className="flex items-center text-[#2563EB] hover:text-[#1d4ed8] transition-colors duration-200 text-sm sm:text-base"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Predictor
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadResults}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm sm:text-base"
              >
                <Download className="w-5 h-5 mr-2" />
                Download
              </button>
              <button
                onClick={handleShareResults}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm sm:text-base"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </button>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your KEAM Prediction Results</h1>
            <p className="text-gray-600 mb-4">
              Generated on {new Date(timestamp).toLocaleString()}
            </p>
            
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <p className="text-sm text-gray-600">Your Rank</p>
                <p className="text-2xl font-bold text-[#2563EB]">{rank.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Category</p>
                <p className="text-2xl font-bold text-gray-900">{category}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">High Chance</p>
                <p className="text-2xl font-bold text-green-600">{prediction.high_chance.length}</p>
                <p className="text-xs text-gray-500">90%+ confidence</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                <Minus className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Medium Chance</p>
                <p className="text-2xl font-bold text-yellow-600">{prediction.medium_chance.length}</p>
                <p className="text-xs text-gray-500">50-90% confidence</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg mr-4">
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Chance</p>
                <p className="text-2xl font-bold text-red-600">{prediction.low_chance.length}</p>
                <p className="text-xs text-gray-500">&lt;50% confidence</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Sections */}
        <div className="space-y-8">
          {/* High Chance Colleges */}
          {prediction.high_chance.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">High Chance Colleges (90%+)</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {prediction.high_chance.map((college, index) => (
                  <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <Building2 className="w-5 h-5 text-green-600 mr-2" />
                        <h3 className="font-semibold text-gray-900">{college.college_name}</h3>
                      </div>
                      <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {college.confidence}%
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      {college.course_name}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="w-4 h-4 mr-2" />
                      {college.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medium Chance Colleges */}
          {prediction.medium_chance.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                  <Minus className="w-6 h-6 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Medium Chance Colleges (50-90%)</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {prediction.medium_chance.map((college, index) => (
                  <div key={index} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <Building2 className="w-5 h-5 text-yellow-600 mr-2" />
                        <h3 className="font-semibold text-gray-900">{college.college_name}</h3>
                      </div>
                      <span className="bg-yellow-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {college.confidence}%
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      {college.course_name}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="w-4 h-4 mr-2" />
                      {college.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Low Chance Colleges */}
          {prediction.low_chance.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Low Chance Colleges (&lt;50%)</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {prediction.low_chance.map((college, index) => (
                  <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <Building2 className="w-5 h-5 text-red-600 mr-2" />
                        <h3 className="font-semibold text-gray-900">{college.college_name}</h3>
                      </div>
                      <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {college.confidence}%
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      {college.course_name}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="w-4 h-4 mr-2" />
                      {college.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {prediction.high_chance.length === 0 && 
           prediction.medium_chance.length === 0 && 
           prediction.low_chance.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
              <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Predictions Available</h3>
              <p className="text-gray-600 mb-6">
                We couldn't generate predictions for your rank and category combination. 
                This might be due to insufficient historical data.
              </p>
              <button
                onClick={handleNewPrediction}
                className="bg-[#2563EB] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200"
              >
                Try Different Parameters
              </button>
            </div>
          )}
        </div>

        {/* Disclaimer and Actions */}
        <div className="mt-8 space-y-6">
          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900 mb-2">Important Disclaimer</h4>
                <p className="text-sm text-yellow-800">
                  This prediction is based on historical data analysis only. Actual cutoffs may vary due to:
                </p>
                <ul className="text-sm text-yellow-800 mt-2 space-y-1">
                  <li>• Changes in number of applicants</li>
                  <li>• Updates in reservation policies</li>
                  <li>• New colleges or courses added</li>
                  <li>• Changes in exam pattern or difficulty</li>
                </ul>
                <p className="text-sm text-yellow-800 mt-2">
                  <strong>Please use this as a reference only and always verify with official sources.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleNewPrediction}
              className="bg-[#2563EB] text-white px-8 py-3 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 font-semibold flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Generate New Prediction
            </button>
            <button
              onClick={() => navigate('/colleges')}
              className="bg-white text-[#2563EB] border-2 border-[#2563EB] px-8 py-3 rounded-lg hover:bg-[#2563EB] hover:text-white transition-all duration-200 font-semibold flex items-center justify-center"
            >
              <Building2 className="w-5 h-5 mr-2" />
              Browse All Colleges
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KEAMResults;