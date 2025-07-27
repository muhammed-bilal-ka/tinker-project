import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileService, UserProfile } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { 
  User, Mail, Phone, MapPin, Edit, Save, X, Calendar, 
  GraduationCap, Briefcase, Shield, Star, Award, 
  Camera, Settings, Bell, Heart, BookOpen, Users
} from 'lucide-react';
import Cropper from 'react-easy-crop';
import Modal from 'react-modal';
import 'react-easy-crop/react-easy-crop.css';

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
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

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

  useEffect(() => {
    if (isLoggedIn && user) {
      loadProfile();
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (profile && profile.avatar_url) setAvatarUrl(profile.avatar_url);
  }, [profile]);

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setSelectedImage(e.target.files[0]);
    setShowCropModal(true);
    setPreviewUrl(URL.createObjectURL(e.target.files[0]));
  };

  const getCroppedImg = async (imageSrc: string, crop: any): Promise<Blob> => {
    const createImage = (url: string) => new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      }, 'image/jpeg');
    });
  };

  const handleCropConfirm = async () => {
    if (!selectedImage || !croppedAreaPixels || !user) return;
    setAvatarUploading(true);
    try {
      const croppedBlob = await getCroppedImg(previewUrl || '', croppedAreaPixels);
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('avatars').upload(fileName, croppedBlob, { upsert: true, contentType: 'image/jpeg' });
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const publicUrl = publicUrlData.publicUrl;
      setAvatarUrl(publicUrl);
      await profileService.updateProfile(user.id, { avatar_url: publicUrl } as any);
      await loadProfile();
      setShowCropModal(false);
      setSelectedImage(null);
      setPreviewUrl('');
    } catch (err) {
      alert('Failed to upload avatar.');
      console.error('Avatar upload error:', err);
    } finally {
      setAvatarUploading(false);
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
      <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="relative mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl opacity-10"></div>
          <div className="relative bg-white rounded-3xl shadow-xl p-4 sm:p-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-0">
              <div className="flex items-center space-x-4 sm:space-x-6 mb-4 sm:mb-6 lg:mb-0">
                <div className="relative">
                  <button type="button" onClick={() => avatarUrl && setShowAvatarModal(true)} className="focus:outline-none">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
                      {profile?.full_name ? getInitials(profile.full_name) : user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  </button>
                  {editing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-all duration-200">
                      <Camera className="w-5 h-5" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={avatarUploading} />
                    </label>
                  )}
                  {avatarUploading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {profile?.full_name || 'Complete Your Profile'}
                  </h1>
                  <p className="text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base">{user?.email}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-xs sm:text-sm text-gray-600">Premium User</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
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
      {/* Avatar Crop Modal */}
      <Modal isOpen={showCropModal} onRequestClose={() => setShowCropModal(false)} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4">Crop your profile picture</h2>
          <div className="relative w-full h-64 bg-gray-100">
            {previewUrl ? (
              <Cropper
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No image selected</div>
            )}
          </div>
          <div className="flex items-center justify-between mt-4">
            <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={e => setZoom(Number(e.target.value))} className="w-2/3" />
            <button onClick={handleCropConfirm} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200" disabled={avatarUploading}>Save</button>
            <button onClick={() => setShowCropModal(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200">Cancel</button>
          </div>
        </div>
      </Modal>
      {/* Avatar Preview Modal */}
      <Modal isOpen={showAvatarModal} onRequestClose={() => setShowAvatarModal(false)} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs flex flex-col items-center">
          <img src={avatarUrl || ''} alt="Avatar Preview" className="w-64 h-64 rounded-full object-cover mb-4" />
          <button onClick={() => setShowAvatarModal(false)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200">Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;