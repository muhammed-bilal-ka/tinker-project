import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-8">
          {/* Error Code */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-4xl sm:text-6xl font-bold text-[#2563EB] mb-1 sm:mb-2">404</h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4">Page Not Found</h2>
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
              The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Illustration */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
              <div className="text-6xl">🔍</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link
              to="/"
              className="w-full bg-[#2563EB] text-white px-6 py-3 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 flex items-center justify-center space-x-2"
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

          {/* Help Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">Need help? Try these popular pages:</p>
            <div className="space-y-2">
              <Link
                to="/colleges"
                className="block text-[#2563EB] hover:text-[#1d4ed8] text-sm transition-colors duration-200"
              >
                Browse Engineering Colleges
              </Link>
              <Link
                to="/events"
                className="block text-[#2563EB] hover:text-[#1d4ed8] text-sm transition-colors duration-200"
              >
                Explore Tech Events
              </Link>
              <Link
                to="/keam-predictor"
                className="block text-[#2563EB] hover:text-[#1d4ed8] text-sm transition-colors duration-200"
              >
                Try KEAM Predictor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;