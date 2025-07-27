import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-8">
          {/* Error Code */}
          <div className="mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-2 sm:mb-4">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-red-600 mb-1 sm:mb-2">401</h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4">Access Denied</h2>
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
              You don't have permission to access this page. Please log in with appropriate credentials or contact an administrator.
            </p>
          </div>

          {/* Illustration */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
              <div className="text-6xl">🔒</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link
              to="/login"
              className="w-full bg-[#2563EB] text-white px-6 py-3 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Shield className="w-5 h-5" />
              <span>Sign In</span>
            </Link>
            
            <Link
              to="/"
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Go to Homepage</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              If you believe this is an error, please contact our support team.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Email: support@seekgram.com
              </p>
              <p className="text-sm text-gray-500">
                Phone: +91 484 123 4567
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;