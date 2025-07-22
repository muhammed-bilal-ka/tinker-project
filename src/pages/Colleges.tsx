import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Star, ExternalLink, GraduationCap, Users } from 'lucide-react';
import { collegeService, type College } from '../lib/supabase';
import CollegeImage from '../components/CollegeImage';
import { useColleges } from '../contexts/CollegesContext';

const Colleges = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showDistrictFilter, setShowDistrictFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { colleges, loading, error, refetch } = useColleges();

  const COLLEGES_PER_PAGE = 15;

  const districts = ['All', 'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kottayam', 'Kollam', 'Alappuzha'];
  const types = ['All', 'Government', 'Private', 'Central', 'State', 'Self-Finance'];

  // Memoize filtered colleges
  const filteredColleges = useMemo(() => colleges.filter(college => {
    const matchesType = selectedType === 'all' || college.type === selectedType;
    const matchesDistrict = selectedDistrict === 'all' || (college.location && college.location.toLowerCase() === selectedDistrict);
    const matchesSearch = !searchTerm || 
      college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (college.location && college.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      college.courses_offered.some(course => course.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesDistrict && matchesSearch;
  }), [colleges, selectedType, selectedDistrict, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredColleges.length / COLLEGES_PER_PAGE);
  const paginatedColleges = useMemo(() => filteredColleges.slice(0, currentPage * COLLEGES_PER_PAGE), [filteredColleges, currentPage]);
  const hasMorePages = currentPage < totalPages;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDistrict, selectedType]);

  // Remove all references to loadingMore, setLoadingMore, setError, setColleges, setHasMore, and handleShowMore, as context now manages all updates. If pagination is needed, implement it with context-aware logic.

  const handleDistrictFilter = (district: string) => {
    setSelectedDistrict(district.toLowerCase());
    setShowDistrictFilter(false);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Engineering Colleges in Kerala
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the best engineering colleges in Kerala with comprehensive information about courses, facilities, and rankings.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search colleges, locations, or courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowDistrictFilter(!showDistrictFilter)}
                  className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent hover:bg-gray-50 transition-colors duration-200"
                >
                  <Filter className="text-gray-400 w-5 h-5" />
                  <span>Filter by District</span>
                </button>
                
                {showDistrictFilter && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="p-2">
                      {districts.map(district => (
                        <button
                          key={district}
                          onClick={() => handleDistrictFilter(district)}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                            selectedDistrict === district.toLowerCase() ? 'bg-[#2563EB] text-white' : 'text-gray-700'
                          }`}
                        >
                          {district}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                >
                  {types.map(type => (
                    <option key={type} value={type.toLowerCase()}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          {loading ? (
            <p className="text-gray-600">Loading colleges...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <p className="text-gray-600">
              Showing {paginatedColleges.length} of {filteredColleges.length} colleges
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-8"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* College Cards */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedColleges.map((college) => (
              <div key={college.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="relative">
                  <CollegeImage
                    imageUrl={college.image_url}
                    collegeName={college.name}
                    collegeType={college.type}
                    className="w-full h-48"
                    size="lg"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className={`text-sm font-medium ${
                      college.type === 'Government' ? 'text-green-600' :
                      college.type === 'Private' ? 'text-blue-600' :
                      college.type === 'Central' ? 'text-purple-600' :
                      college.type === 'Self-Finance' ? 'text-orange-600' :
                      'text-gray-600'
                    }`}>
                      {college.type}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{college.name}</h3>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{college.location}</span>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{college.rating}</span>
                    <span className="text-gray-500 text-sm ml-2">({college.total_seats} seats)</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{college.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {college.courses_offered.slice(0, 3).map((course, index) => (
                        <span key={index} className="bg-[#2563EB]/10 text-[#2563EB] px-2 py-1 rounded-md text-xs">
                          {course.replace(' Engineering', '')}
                        </span>
                      ))}
                      {college.courses_offered.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                          +{college.courses_offered.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/colleges/${college.id}`}
                      className="bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 flex items-center space-x-2"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>View Details</span>
                    </Link>
                    
                    {college.website && (
                      <a
                        href={college.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2563EB] hover:text-[#1d4ed8] transition-colors duration-200"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show More Button */}
        {!loading && !error && paginatedColleges.length > 0 && hasMorePages && (
          <div className="text-center">
            <button 
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={loading}
              className="bg-white text-[#2563EB] border-2 border-[#2563EB] px-8 py-3 rounded-xl font-semibold hover:bg-[#2563EB] hover:text-white transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2563EB]"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <span>Show More Colleges</span>
              )}
            </button>
          </div>
        )}

        {/* Loading More Indicator */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2563EB]"></div>
              <span>Loading more colleges...</span>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && paginatedColleges.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No colleges found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDistrict('all');
                  setSelectedType('all');
                }}
                className="bg-[#2563EB] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Colleges;