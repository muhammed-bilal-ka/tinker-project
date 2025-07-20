import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileService, UserProfile } from '../lib/supabase';
import { 
  User, Mail, Phone, MapPin, Edit, Save, X, Calendar, 
  GraduationCap, Briefcase, Shield, Star, Award, 
  Camera, Settings, Bell, Heart, BookOpen, Users
} from 'lucide-react';

const Profile = () => {
  const { user, isLoggedIn } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    city: '',
    pincode: '',
    profession: '',
    qualification: ''
  });

  useEffect(() => {
    if (isLoggedIn && user) {
      loadProfile();
    }
  }, [isLoggedIn, user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await profileService.getProfile(user.id);
      if (error) {
        console.error('Error loading profile:', error);
      } else {
        setProfile(data);
        if (data) {
          setFormData({
            full_name: data.full_name || '',
            phone: data.phone || '',
            city: data.city || '',
            pincode: data.pincode || '',
            profession: data.profession || '',
            qualification: data.qualification || ''
          });
        }
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { data, error } = await profileService.updateProfile(user.id, formData);
      if (error) {
        console.error('Error updating profile:', error);
      } else {
        setProfile(data);
        setEditing(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        city: profile.city || '',
        pincode: profile.pincode || '',
        profession: profile.profession || '',
        qualification: profile.qualification || ''
      });
    }
    setEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getProfileCompletion = () => {
    if (!profile) return 0;
    const fields = ['full_name', 'phone', 'city', 'pincode', 'profession', 'qualification'];
    const filledFields = fields.filter(field => profile[field as keyof UserProfile]);
    return Math.round((filledFields.length / fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading your profile...</h3>
            <p className="text-gray-600 max-w-md mx-auto">We're fetching your personalized information to create the best experience for you.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl opacity-10"></div>
          <div className="relative bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {profile?.full_name ? getInitials(profile.full_name) : user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {profile?.full_name || 'Complete Your Profile'}
                  </h1>
                  <p className="text-gray-600 mb-3">{user?.email}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">Premium User</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Completion Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Profile Completion</h2>
                <span className="text-2xl font-bold text-blue-600">{getProfileCompletion()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${getProfileCompletion()}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {getProfileCompletion() < 100 
                  ? `Complete ${6 - Object.values(formData).filter(v => v).length} more fields to get 100%`
                  : 'Your profile is complete! 🎉'
                }
              </p>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                <div className="flex items-center space-x-2 text-blue-600">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium">Secure</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-blue-500" />
                    Email Address
                  </label>
                  <div className="bg-gray-50 rounded-xl p-4 border-2 border-transparent group-hover:border-blue-200 transition-all duration-200">
                    <span className="text-gray-900 font-medium">{user?.email}</span>
                  </div>
                </div>

                {/* Full Name */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-500" />
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-transparent group-hover:border-blue-200 transition-all duration-200">
                      <span className="text-gray-900 font-medium">{profile?.full_name || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-blue-500" />
                    Phone Number
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-transparent group-hover:border-blue-200 transition-all duration-200">
                      <span className="text-gray-900 font-medium">{profile?.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {/* City */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    City
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your city"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-transparent group-hover:border-blue-200 transition-all duration-200">
                      <span className="text-gray-900 font-medium">{profile?.city || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {/* Pincode */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    Pincode
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your pincode"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-transparent group-hover:border-blue-200 transition-all duration-200">
                      <span className="text-gray-900 font-medium">{profile?.pincode || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {/* Profession */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                    Profession
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your profession"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-transparent group-hover:border-blue-200 transition-all duration-200">
                      <span className="text-gray-900 font-medium">{profile?.profession || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {/* Qualification */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2 text-blue-500" />
                    Qualification
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your qualification"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-transparent group-hover:border-blue-200 transition-all duration-200">
                      <span className="text-gray-900 font-medium">{profile?.qualification || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {editing && (
                <div className="flex items-center space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-5 h-5 mr-2" />
                    )}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Colleges Viewed</p>
                      <p className="text-lg font-bold text-gray-900">12</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Favorites</p>
                      <p className="text-lg font-bold text-gray-900">5</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Events Attended</p>
                      <p className="text-lg font-bold text-gray-900">3</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-all duration-200">
                    <Settings className="w-4 h-4 text-blue-600 group-hover:text-white" />
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900">Account Settings</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition-all duration-200">
                    <Bell className="w-4 h-4 text-purple-600 group-hover:text-white" />
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900">Notifications</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-all duration-200">
                    <Award className="w-4 h-4 text-green-600 group-hover:text-white" />
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900">Achievements</span>
                </button>
              </div>
            </div>

            {/* Profile Tips */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-3">💡 Profile Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-300">•</span>
                  <span>Complete your profile to unlock premium features</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-300">•</span>
                  <span>Add your qualification for better college recommendations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-300">•</span>
                  <span>Keep your contact info updated for important notifications</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;