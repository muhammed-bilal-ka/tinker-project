import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Calendar, Settings, Edit3, Heart, BookOpen } from 'lucide-react';

const Profile = () => {
  // Mock user data
  const user = {
    name: 'Arjun Krishnan',
    email: 'arjun.krishnan@gmail.com',
    phone: '+91 9876543210',
    city: 'Kochi',
    pincode: '682001',
    profession: 'Software Engineer',
    qualification: 'Postgraduate (PG)',
    ugCollege: 'College of Engineering Trivandrum',
    ugBranch: 'Computer Science Engineering',
    ugYear: '2021',
    pgCollege: 'Indian Institute of Technology Delhi',
    pgBranch: 'Computer Science Engineering',
    pgYear: '2023',
    joinedDate: '2024-01-15',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200'
  };

  // Mock activity data
  const savedColleges = [
    { id: 1, name: 'College of Engineering Trivandrum', location: 'Thiruvananthapuram' },
    { id: 2, name: 'NIT Calicut', location: 'Kozhikode' },
    { id: 3, name: 'Cochin University of Science and Technology', location: 'Kochi' }
  ];

  const savedEvents = [
    { id: 1, title: 'Kerala Tech Summit 2024', date: '2024-03-15', location: 'Kochi' },
    { id: 2, title: 'CodeStorm Hackathon', date: '2024-03-22', location: 'Thiruvananthapuram' }
  ];

  const recentActivity = [
    { action: 'Viewed College Details', item: 'College of Engineering Trivandrum', date: '2 days ago' },
    { action: 'Used KEAM Predictor', item: 'Rank: 5000', date: '1 week ago' },
    { action: 'Saved Event', item: 'Kerala Tech Summit 2024', date: '2 weeks ago' }
  ];

  const getBranchLabel = (branch: string) => {
    const branches: { [key: string]: string } = {
      'computer_science': 'Computer Science Engineering',
      'electronics': 'Electronics & Communication',
      'mechanical': 'Mechanical Engineering',
      'civil': 'Civil Engineering',
      'electrical': 'Electrical Engineering',
      'chemical': 'Chemical Engineering',
      'information_technology': 'Information Technology'
    };
    return branches[branch] || branch;
  };

  const getProfessionLabel = (profession: string) => {
    const professions: { [key: string]: string } = {
      'student': 'Student',
      'software_engineer': 'Software Engineer',
      'data_scientist': 'Data Scientist',
      'product_manager': 'Product Manager',
      'designer': 'Designer',
      'entrepreneur': 'Entrepreneur',
      'researcher': 'Researcher',
      'consultant': 'Consultant'
    };
    return professions[profession] || profession;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-[#2563EB]"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
              <p className="text-xl text-gray-600 mb-1">{getProfessionLabel(user.profession)}</p>
              <p className="text-gray-500">{user.city}, Kerala</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/profile/edit"
                className="bg-[#2563EB] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </Link>
              <button className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-all duration-200">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{user.city}, {user.pincode}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Joined</p>
                    <p className="font-medium text-gray-900">{new Date(user.joinedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Professional Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Current Role</p>
                    <p className="font-medium text-gray-900">{getProfessionLabel(user.profession)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Qualification</p>
                    <p className="font-medium text-gray-900">{user.qualification}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Information */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Educational Background
              </h2>
              <div className="space-y-6">
                {/* UG */}
                <div className="border-l-4 border-[#2563EB] pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Undergraduate</h3>
                  <p className="text-gray-700 font-medium">{user.ugCollege}</p>
                  <p className="text-gray-600">{getBranchLabel(user.ugBranch)}</p>
                  <p className="text-sm text-gray-500">Graduated: {user.ugYear}</p>
                </div>
                
                {/* PG */}
                <div className="border-l-4 border-[#FACC15] pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Postgraduate</h3>
                  <p className="text-gray-700 font-medium">{user.pgCollege}</p>
                  <p className="text-gray-600">{getBranchLabel(user.pgBranch)}</p>
                  <p className="text-sm text-gray-500">Graduated: {user.pgYear}</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-2 h-2 bg-[#2563EB] rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.item}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Saved Colleges */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Saved Colleges
              </h3>
              <div className="space-y-3">
                {savedColleges.map((college) => (
                  <div key={college.id}>
                    <Link
                      to={`/colleges/${college.id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <h4 className="font-medium text-gray-900 text-sm">{college.name}</h4>
                      <p className="text-xs text-gray-600">{college.location}</p>
                    </Link>
                  </div>
                ))}
              </div>
              <Link
                to="/colleges"
                className="block text-center mt-4 text-[#2563EB] hover:text-[#1d4ed8] text-sm font-medium"
              >
                View All Colleges
              </Link>
            </div>

            {/* Saved Events */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                Saved Events
              </h3>
              <div className="space-y-3">
                {savedEvents.map((event) => (
                  <div key={event.id}>
                    <Link
                      to={`/events/${event.id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                      <p className="text-xs text-gray-600">{event.location}</p>
                      <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                    </Link>
                  </div>
                ))}
              </div>
              <Link
                to="/events"
                className="block text-center mt-4 text-[#2563EB] hover:text-[#1d4ed8] text-sm font-medium"
              >
                View All Events
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/keam-predictor"
                  className="block w-full bg-[#2563EB] text-white text-center py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200"
                >
                  Try KEAM Predictor
                </Link>
                <Link
                  to="/colleges"
                  className="block w-full border border-[#2563EB] text-[#2563EB] text-center py-2 rounded-lg hover:bg-[#2563EB] hover:text-white transition-all duration-200"
                >
                  Browse Colleges
                </Link>
                <Link
                  to="/events"
                  className="block w-full border border-gray-300 text-gray-700 text-center py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Find Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;