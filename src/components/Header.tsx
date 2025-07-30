import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../hooks/useAdmin';
import { profileService } from '../lib/supabase';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userFullName, setUserFullName] = useState<string>('');
  const location = useLocation();
  const { isLoggedIn, user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const { data } = await profileService.getProfile(user.id);
          if (data?.full_name) {
            setUserFullName(data.full_name);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Colleges', path: '/colleges' },
    { name: 'Events', path: '/events' },
    { name: 'KEAM Predictor', path: '/keam-predictor' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#FACC15] rounded-lg flex items-center justify-center border-2 border-[#2563EB]/20">
              <span className="text-[#2563EB] font-bold text-lg">SG</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SeekGram</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-[#2563EB] text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-[#2563EB]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  <span>{userFullName || user?.email?.split('@')[0] || 'Profile'}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-[#2563EB] transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/20">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-[#2563EB] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200/20">
                {isLoggedIn ? (
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/profile"
                      className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button 
                      onClick={handleSignOut}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-left"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/login"
                      className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="px-3 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;