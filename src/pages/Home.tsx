import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, GraduationCap, Calculator, TrendingUp } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <GraduationCap className="w-8 h-8 text-[#191970]" />,
      title: 'Engineering Colleges',
      description: 'Discover top engineering colleges in Kerala with detailed information about courses, facilities, and rankings.',
      link: '/colleges'
    },
    {
      icon: <Calendar className="w-8 h-8 text-[#191970]" />,
      title: 'Tech Events',
      description: 'Stay updated with the latest hackathons, conferences, and tech events happening across Kerala.',
      link: '/events'
    },
    {
      icon: <Calculator className="w-8 h-8 text-[#191970]" />,
      title: 'KEAM Predictor',
      description: 'Get accurate predictions for college admissions based on your KEAM rank and category.',
      link: '/keam-predictor'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-[#191970]" />,
      title: 'Analytics & Insights',
      description: 'Access comprehensive data and insights about Kerala\'s tech ecosystem and education landscape.',
      link: '/colleges'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#eac843a6] to-white py-16 sm:py-20 lg:py-32 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#eac843] rounded-2xl flex items-center justify-center border-4 border-[#191970]/10 shadow-lg">
              <span className="text-[#191970] font-bold text-3xl sm:text-4xl">SG</span>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            <span className="text-gray-900">Your Gateway to</span><br />
            <span className="text-[#191970]">Kerala's Tech Ecosystem</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed">
            Discover hackathons, explore engineering colleges, and predict your KEAM rank - all in one place. Join Kerala's largest tech community today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-md mx-auto">
            <Link
              to="/events"
              className="bg-[#191970] text-[#eac843] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-[#191970]/90 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 w-full sm:w-auto text-sm sm:text-base"
            >
              <span>Explore Events →</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/keam-predictor"
              className="bg-white text-[#191970] border-2 border-[#191970] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-[#191970] hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 w-full sm:w-auto text-sm sm:text-base"
            >
              <span>Try KEAM Predictor</span>
              <Calculator className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Everything You Need for Your Tech Journey
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
              SeekGram brings together comprehensive resources for students, professionals, and tech enthusiasts in Kerala.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="mb-3 sm:mb-4">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">{feature.description}</p>
                <Link
                  to={feature.link}
                  className="inline-flex items-center text-[#191970] hover:text-[#191970]/80 font-medium transition-colors duration-200 text-sm sm:text-base"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:py-16 bg-gradient-to-r from-[#191970] to-[#191970]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="text-white">
              <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">50+</div>
              <div className="text-white/80 text-xs sm:text-base">Engineering Colleges</div>
            </div>
            <div className="text-white">
              <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">200+</div>
              <div className="text-white/80 text-xs sm:text-base">Tech Events</div>
            </div>
            <div className="text-white">
              <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">10K+</div>
              <div className="text-white/80 text-xs sm:text-base">Students Helped</div>
            </div>
            <div className="text-white">
              <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">95%</div>
              <div className="text-white/80 text-xs sm:text-base">Prediction Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 border border-gray-100">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8">
              Join thousands of students and professionals who trust SeekGram for their tech career decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-md mx-auto">
              <Link
                to="/signup"
                className="bg-[#191970] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-[#191970]/90 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto text-sm sm:text-base"
              >
                Get Started Today
              </Link>
              <Link
                to="/colleges"
                className="border-2 border-[#191970] text-[#191970] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-[#191970] hover:text-white transition-all duration-200 w-full sm:w-auto text-sm sm:text-base"
              >
                Browse Colleges
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;