import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, ExternalLink, Info } from 'lucide-react';

const KEAMResults = () => {
  const [predictionData, setPredictionData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('keamPredictionData');
    if (data) {
      setPredictionData(JSON.parse(data));
    }
  }, []);

  // Mock college data based on prediction
  const getCollegePredictions = () => {
    if (!predictionData) return { high: [], medium: [], low: [] };

    const rank = parseInt(predictionData.rank);
    const category = predictionData.category;
    const location = predictionData.location;
    const branch = predictionData.branch;

    // Mock prediction logic
    const allColleges = [
      {
        id: 1,
        name: 'College of Engineering Trivandrum',
        location: 'Thiruvananthapuram',
        branch: 'Computer Science Engineering',
        cutoff: 2500,
        type: 'Government',
        fees: '₹15,000/year',
        rating: 4.5,
        website: 'https://cet.ac.in'
      },
      {
        id: 2,
        name: 'NIT Calicut',
        location: 'Kozhikode',
        branch: 'Computer Science Engineering',
        cutoff: 1200,
        type: 'Central',
        fees: '₹1,25,000/year',
        rating: 4.8,
        website: 'https://nitc.ac.in'
      },
      {
        id: 3,
        name: 'Cochin University of Science and Technology',
        location: 'Kochi',
        branch: 'Computer Science Engineering',
        cutoff: 3000,
        type: 'State',
        fees: '₹25,000/year',
        rating: 4.3,
        website: 'https://cusat.ac.in'
      },
      {
        id: 4,
        name: 'Government Engineering College Thrissur',
        location: 'Thrissur',
        branch: 'Electronics & Communication',
        cutoff: 4000,
        type: 'Government',
        fees: '₹15,000/year',
        rating: 4.2,
        website: 'https://gectcr.ac.in'
      },
      {
        id: 5,
        name: 'Rajiv Gandhi Institute of Technology',
        location: 'Kottayam',
        branch: 'Mechanical Engineering',
        cutoff: 5000,
        type: 'Government',
        fees: '₹15,000/year',
        rating: 4.1,
        website: 'https://rit.ac.in'
      },
      {
        id: 6,
        name: 'Toc H Institute of Science and Technology',
        location: 'Kochi',
        branch: 'Computer Science Engineering',
        cutoff: 8000,
        type: 'Private',
        fees: '₹85,000/year',
        rating: 4.0,
        website: 'https://tistcochin.in'
      },
      {
        id: 7,
        name: 'Mar Athanasius College of Engineering',
        location: 'Kottayam',
        branch: 'Electronics & Communication',
        cutoff: 10000,
        type: 'Private',
        fees: '₹75,000/year',
        rating: 3.9,
        website: 'https://mace.ac.in'
      },
      {
        id: 8,
        name: 'Sree Chitra Thirunal College of Engineering',
        location: 'Thiruvananthapuram',
        branch: 'Civil Engineering',
        cutoff: 12000,
        type: 'Government',
        fees: '₹15,000/year',
        rating: 4.0,
        website: 'https://sctce.ac.in'
      }
    ];

    const high = allColleges.filter(college => college.cutoff > rank * 1.2);
    const medium = allColleges.filter(college => college.cutoff <= rank * 1.2 && college.cutoff > rank * 0.8);
    const low = allColleges.filter(college => college.cutoff <= rank * 0.8);

    return { high, medium, low };
  };

  const { high, medium, low } = getCollegePredictions();

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      'general': 'General',
      'obc': 'OBC',
      'sc': 'SC',
      'st': 'ST',
      'ezhava': 'Ezhava',
      'muslim': 'Muslim',
      'latin': 'Latin Catholic',
      'other': 'Other'
    };
    return categories[category] || category;
  };

  const getLocationLabel = (location: string) => {
    const locations: { [key: string]: string } = {
      'thiruvananthapuram': 'Thiruvananthapuram',
      'kochi': 'Kochi',
      'kozhikode': 'Kozhikode',
      'thrissur': 'Thrissur',
      'kottayam': 'Kottayam',
      'kollam': 'Kollam',
      'palakkad': 'Palakkad',
      'anywhere': 'Anywhere in Kerala'
    };
    return locations[location] || location;
  };

  const getBranchLabel = (branch: string) => {
    const branches: { [key: string]: string } = {
      'computer': 'Computer Science Engineering',
      'electronics': 'Electronics & Communication',
      'mechanical': 'Mechanical Engineering',
      'civil': 'Civil Engineering',
      'electrical': 'Electrical Engineering',
      'chemical': 'Chemical Engineering',
      'it': 'Information Technology',
      'any': 'Any Branch'
    };
    return branches[branch] || branch;
  };

  const CollegeCard = ({ college, chanceType }: { college: any, chanceType: 'high' | 'medium' | 'low' }) => {
    const getChanceIcon = () => {
      switch (chanceType) {
        case 'high':
          return <TrendingUp className="w-5 h-5 text-green-600" />;
        case 'medium':
          return <Minus className="w-5 h-5 text-yellow-600" />;
        case 'low':
          return <TrendingDown className="w-5 h-5 text-red-600" />;
      }
    };

    const getChanceColor = () => {
      switch (chanceType) {
        case 'high':
          return 'text-green-600 bg-green-50';
        case 'medium':
          return 'text-yellow-600 bg-yellow-50';
        case 'low':
          return 'text-red-600 bg-red-50';
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{college.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{college.location}</p>
            <p className="text-sm text-[#2563EB] font-medium">{college.branch}</p>
          </div>
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${getChanceColor()}`}>
            {getChanceIcon()}
            <span className="text-sm font-medium capitalize">{chanceType}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Cutoff Rank</p>
            <p className="font-semibold text-gray-900">{college.cutoff.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Type</p>
            <p className="font-semibold text-gray-900">{college.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Fees</p>
            <p className="font-semibold text-gray-900">{college.fees}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Rating</p>
            <p className="font-semibold text-gray-900">{college.rating}/5</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Link
            to={`/colleges/${college.id}`}
            className="bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 text-sm"
          >
            View Details
          </Link>
          <a
            href={college.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2563EB] hover:text-[#1d4ed8] transition-colors duration-200"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  };

  if (!predictionData) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Prediction Data Found</h1>
            <p className="text-gray-600 mb-8">Please go back and enter your details to get predictions.</p>
            <Link
              to="/keam-predictor"
              className="bg-[#2563EB] text-white px-8 py-3 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200"
            >
              Back to Predictor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/keam-predictor"
          className="inline-flex items-center text-[#2563EB] hover:text-[#1d4ed8] mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Predictor
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your KEAM Predictions
          </h1>
          <p className="text-xl text-gray-600">
            Based on your rank and preferences, here are your college admission chances
          </p>
        </div>

        {/* Input Summary */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Details</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">KEAM Rank</p>
              <p className="font-semibold text-gray-900">{parseInt(predictionData.rank).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-semibold text-gray-900">{getCategoryLabel(predictionData.category)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Preferred Location</p>
              <p className="font-semibold text-gray-900">{getLocationLabel(predictionData.location)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Preferred Branch</p>
              <p className="font-semibold text-gray-900">{getBranchLabel(predictionData.branch)}</p>
            </div>
          </div>
        </div>

        {/* High Chance */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-semibold text-gray-900">High Chance Colleges</h2>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {high.length} colleges
            </span>
          </div>
          
          {high.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {high.map((college) => (
                <CollegeCard key={college.id} college={college} chanceType="high" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
              <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No high chance colleges found for your rank and preferences.</p>
            </div>
          )}
        </div>

        {/* Medium Chance */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Minus className="w-6 h-6 text-yellow-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Medium Chance Colleges</h2>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {medium.length} colleges
            </span>
          </div>
          
          {medium.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medium.map((college) => (
                <CollegeCard key={college.id} college={college} chanceType="medium" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
              <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No medium chance colleges found for your rank and preferences.</p>
            </div>
          )}
        </div>

        {/* Low Chance */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingDown className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Low Chance Colleges</h2>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {low.length} colleges
            </span>
          </div>
          
          {low.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {low.map((college) => (
                <CollegeCard key={college.id} college={college} chanceType="low" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
              <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No low chance colleges found for your rank and preferences.</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Want to try different preferences?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/keam-predictor"
              className="bg-[#2563EB] text-white px-8 py-3 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200"
            >
              Try New Prediction
            </Link>
            <Link
              to="/colleges"
              className="border-2 border-[#2563EB] text-[#2563EB] px-8 py-3 rounded-lg hover:bg-[#2563EB] hover:text-white transition-all duration-200"
            >
              Browse All Colleges
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KEAMResults;