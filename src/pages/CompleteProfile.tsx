import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { User, Phone, MapPin, GraduationCap, Briefcase, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../lib/supabase';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: (location.state && location.state.fullName) || '',
    phone: '',
    email: user?.email || '',
    profession: '',
    qualification: '',
    city: '',
    pincode: '',
    ugCollege: '',
    ugBranch: '',
    ugYear: '',
    pgCollege: '',
    pgBranch: '',
    pgYear: '',
    consent: false
  });

  const professions = [
    { value: 'student', label: 'Student' },
    { value: 'software_engineer', label: 'Software Engineer' },
    { value: 'data_scientist', label: 'Data Scientist' },
    { value: 'product_manager', label: 'Product Manager' },
    { value: 'designer', label: 'Designer' },
    { value: 'entrepreneur', label: 'Entrepreneur' },
    { value: 'researcher', label: 'Researcher' },
    { value: 'consultant', label: 'Consultant' },
    { value: 'other', label: 'Other' }
  ];

  const qualifications = [
    { value: 'plus_two', label: '+2 / 12th Standard' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'ug', label: 'Undergraduate (UG)' },
    { value: 'pg', label: 'Postgraduate (PG)' },
    { value: 'phd', label: 'PhD' },
    { value: 'other', label: 'Other' }
  ];

  const branches = [
    { value: 'computer_science', label: 'Computer Science Engineering' },
    { value: 'electronics', label: 'Electronics & Communication' },
    { value: 'mechanical', label: 'Mechanical Engineering' },
    { value: 'civil', label: 'Civil Engineering' },
    { value: 'electrical', label: 'Electrical Engineering' },
    { value: 'chemical', label: 'Chemical Engineering' },
    { value: 'information_technology', label: 'Information Technology' },
    { value: 'other', label: 'Other' }
  ];

  const years = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
    { value: '2018', label: '2018' },
    { value: '2017', label: '2017' },
    { value: '2016', label: '2016' },
    { value: '2015', label: '2015' },
    { value: 'other', label: 'Other' }
  ];

  // Redirect if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to complete your profile.</p>
            <Link
              to="/login"
              className="bg-[#2563EB] text-white px-6 py-3 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setLoading(true);
    setError('');

    try {
      const profileData = {
        user_id: user.id,
        full_name: formData.fullName,
        phone: formData.phone,
        email: user.email,
        profession: formData.profession,
        qualification: formData.qualification,
        city: formData.city || '',
        pincode: formData.pincode || '',
        ug_college: formData.ugCollege || undefined,
        ug_branch: formData.ugBranch || undefined,
        ug_year: formData.ugYear || undefined,
        pg_college: formData.pgCollege || undefined,
        pg_branch: formData.pgBranch || undefined,
        pg_year: formData.pgYear || undefined,
        consent: formData.consent
      };

      const { error } = await profileService.createProfile(profileData);
      
      if (error) {
        setError(error.message || 'Failed to create profile');
      } else {
        navigate('/profile');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating your profile');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      fullName: '',
      phone: '',
      email: user?.email || '',
      profession: '',
      qualification: '',
      city: '',
      pincode: '',
      ugCollege: '',
      ugBranch: '',
      ugYear: '',
      pgCollege: '',
      pgBranch: '',
      pgYear: '',
      consent: false
    });
  };

  const showUGFields = formData.qualification === 'ug' || formData.qualification === 'pg';
  const showPGFields = formData.qualification === 'pg';

  const isFormValid = formData.fullName && formData.phone && formData.email && formData.profession && formData.qualification;
  return (
    <div className="min-h-screen py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Complete Your Profile
          </h1>
          <p className="text-base sm:text-xl text-gray-600">
            Help us personalize your SeekGram experience
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center text-white text-sm font-medium">
                <Check className="w-4 h-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Account Created</span>
            </div>
            <div className="w-16 h-1 bg-[#2563EB] rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center text-white text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Profile Setup</span>
            </div>
            <div className="w-16 h-1 bg-gray-200 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm text-gray-600">Complete</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    placeholder="Enter your city"
                  />
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    placeholder="Enter your pincode"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Professional Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
                    Profession *
                  </label>
                  <select
                    id="profession"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  >
                    <option value="">Select your profession</option>
                    {professions.map(profession => (
                      <option key={profession.value} value={profession.value}>
                        {profession.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
                    Highest Qualification *
                  </label>
                  <select
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  >
                    <option value="">Select your qualification</option>
                    {qualifications.map(qualification => (
                      <option key={qualification.value} value={qualification.value}>
                        {qualification.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Educational Information */}
            {showUGFields && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Undergraduate Details
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ugCollege" className="block text-sm font-medium text-gray-700 mb-1">
                      College Name
                    </label>
                    <input
                      type="text"
                      id="ugCollege"
                      name="ugCollege"
                      value={formData.ugCollege}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      placeholder="Enter your college name"
                    />
                  </div>
                  <div>
                    <label htmlFor="ugBranch" className="block text-sm font-medium text-gray-700 mb-1">
                      Branch
                    </label>
                    <select
                      id="ugBranch"
                      name="ugBranch"
                      value={formData.ugBranch}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    >
                      <option value="">Select your branch</option>
                      {branches.map(branch => (
                        <option key={branch.value} value={branch.value}>
                          {branch.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="ugYear" className="block text-sm font-medium text-gray-700 mb-1">
                      Passing Year
                    </label>
                    <select
                      id="ugYear"
                      name="ugYear"
                      value={formData.ugYear}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    >
                      <option value="">Select year</option>
                      {years.map(year => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Postgraduate Information */}
            {showPGFields && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Postgraduate Details
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pgCollege" className="block text-sm font-medium text-gray-700 mb-1">
                      College Name
                    </label>
                    <input
                      type="text"
                      id="pgCollege"
                      name="pgCollege"
                      value={formData.pgCollege}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      placeholder="Enter your college name"
                    />
                  </div>
                  <div>
                    <label htmlFor="pgBranch" className="block text-sm font-medium text-gray-700 mb-1">
                      Branch
                    </label>
                    <select
                      id="pgBranch"
                      name="pgBranch"
                      value={formData.pgBranch}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    >
                      <option value="">Select your branch</option>
                      {branches.map(branch => (
                        <option key={branch.value} value={branch.value}>
                          {branch.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pgYear" className="block text-sm font-medium text-gray-700 mb-1">
                      Passing Year
                    </label>
                    <select
                      id="pgYear"
                      name="pgYear"
                      value={formData.pgYear}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    >
                      <option value="">Select year</option>
                      {years.map(year => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Consent */}
            <div className="mb-8">
              <div className="flex items-center">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB] border-gray-300 rounded"
                />
                <label htmlFor="consent" className="ml-2 block text-sm text-gray-700">
                  I consent to SeekGram using my information to provide personalized recommendations and updates about relevant tech events, colleges, and opportunities. *
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="flex-1 bg-[#2563EB] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1d4ed8] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Profile...' : 'Complete Profile'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="flex-1 sm:flex-initial bg-gray-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;