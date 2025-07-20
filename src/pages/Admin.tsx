import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Building2, Calendar, FileText, Upload, 
  Settings, BarChart3, Shield, Plus, Edit, Trash2,
  Download, Eye, CheckCircle, XCircle, AlertCircle,
  UserPlus, UserMinus, RefreshCw, BarChart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  collegeService, 
  eventService, 
  keamService,
  AdminRole,
  College,
  Event,
  KEAMRankData,
  FileUpload,
  FlaggedReview
} from '../lib/supabase';
import { adminService } from '../lib/adminService';
import { CollegeForm, EventForm, KEAMForm } from '../components/AdminForms';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data states
  const [colleges, setColleges] = useState<College[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [keamData, setKeamData] = useState<KEAMRankData[]>([]);
  const [fileUploads, setFileUploads] = useState<FileUpload[]>([]);
  const [flaggedReviews, setFlaggedReviews] = useState<FlaggedReview[]>([]);
  
  // Form states
  const [showCollegeForm, setShowCollegeForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showKeamForm, setShowKeamForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Edit states
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingKeam, setEditingKeam] = useState<KEAMRankData | null>(null);
  
  // Additional data states
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Check admin status on component mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isLoggedIn || !user) {
        setError('You must be logged in to access the admin panel');
        setLoading(false);
        return;
      }

      console.log('Checking admin status for user:', user.id);
      console.log('User email:', user.email);

      try {
        const { data: adminData, error: adminError } = await adminService.checkAdminStatus(user.id);
        
        console.log('Admin check result:', { adminData, adminError });
        
        if (adminError) {
          console.error('Admin check error:', adminError);
          setError(`Access denied. Admin privileges required. Error: ${adminError.message}`);
          setLoading(false);
          return;
        }

        if (!adminData) {
          setError('Access denied. Admin privileges required. No admin role found.');
          setLoading(false);
          return;
        }

        setAdminRole(adminData);
        
        // Get admin permissions
        const { data: perms } = await adminService.getAdminPermissions(user.id);
        setPermissions(perms);
        
        // Load initial data
        await loadDashboardData();
        
      } catch (err) {
        setError('Failed to verify admin status');
        console.error('Admin status check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [isLoggedIn, user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      // Load colleges
      const { data: collegesData } = await collegeService.getColleges();
      setColleges(collegesData || []);

      // Load events
      const { data: eventsData } = await eventService.getEvents();
      setEvents(eventsData || []);

      // Load KEAM data
      const { data: keamData } = await keamService.getKEAMRankData();
      setKeamData(keamData || []);

      // Load file uploads
      const { data: uploadsData } = await adminService.getFileUploads(user.id);
      setFileUploads(uploadsData || []);

      // Load flagged reviews (with error handling)
      try {
        const { data: reviewsData, error: reviewsError } = await adminService.getFlaggedReviews();
        if (reviewsError) {
          console.warn('Could not load flagged reviews:', reviewsError);
          setFlaggedReviews([]);
        } else {
          setFlaggedReviews(reviewsData || []);
        }
      } catch (reviewsErr) {
        console.warn('Exception loading flagged reviews:', reviewsErr);
        setFlaggedReviews([]);
      }

    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  const handleFileUpload = async (uploadType: string) => {
    if (!selectedFile || !user) return;

    try {
      // In a real app, you'd upload to Supabase Storage first
      // For now, we'll simulate the upload
      const fileData = {
        admin_id: user.id,
        file_name: selectedFile.name,
        file_type: selectedFile.type,
        file_size: selectedFile.size,
        file_url: `https://example.com/uploads/${selectedFile.name}`,
        upload_type: uploadType as 'college_data' | 'event_data' | 'keam_data' | 'other',
        status: 'uploaded' as const,
        metadata: {
          originalName: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type
        }
      };

      const { error } = await adminService.uploadFile(fileData);
      
      if (error) {
        alert('Failed to upload file');
        return;
      }

      alert('File uploaded successfully!');
      setSelectedFile(null);
      await loadDashboardData();

    } catch (err) {
      alert('Failed to upload file');
      console.error('File upload error:', err);
    }
  };

  const handleDeleteCollege = async (collegeId: string) => {
    if (!confirm('Are you sure you want to delete this college?')) return;

    try {
      const { error } = await adminService.deleteCollege(collegeId);
      
      if (error) {
        alert('Failed to delete college');
        return;
      }

      alert('College deleted successfully!');
      await loadDashboardData();

    } catch (err) {
      alert('Failed to delete college');
      console.error('Delete college error:', err);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await adminService.deleteEvent(eventId);
      
      if (error) {
        alert('Failed to delete event');
        return;
      }

      alert('Event deleted successfully!');
      await loadDashboardData();

    } catch (err) {
      alert('Failed to delete event');
      console.error('Delete event error:', err);
    }
  };

  const handleResolveFlaggedReview = async (reviewId: string, status: string) => {
    if (!user) return;

    try {
      const updateData = {
        status: status as any,
        resolved_by: user.id,
        resolved_at: new Date().toISOString()
      };

      const { error } = await adminService.updateFlaggedReview(reviewId, updateData);
      
      if (error) {
        alert('Failed to update review status');
        return;
      }

      alert('Review status updated successfully!');
      await loadDashboardData();

    } catch (err) {
      alert('Failed to update review status');
      console.error('Update review error:', err);
    }
  };

  // College management handlers
  const handleCreateCollege = async (collegeData: Partial<College>) => {
    try {
      const { error } = await adminService.createCollege(collegeData);
      
      if (error) {
        alert('Failed to create college');
        return;
      }

      alert('College created successfully!');
      setShowCollegeForm(false);
      setEditingCollege(null);
      await loadDashboardData();

    } catch (err) {
      alert('Failed to create college');
      console.error('Create college error:', err);
    }
  };

  const handleUpdateCollege = async (collegeData: Partial<College>) => {
    if (!editingCollege) return;

    try {
      const { error } = await adminService.updateCollege(editingCollege.id, collegeData);
      
      if (error) {
        alert('Failed to update college');
        return;
      }

      alert('College updated successfully!');
      setShowCollegeForm(false);
      setEditingCollege(null);
      await loadDashboardData();

    } catch (err) {
      alert('Failed to update college');
      console.error('Update college error:', err);
    }
  };

  const handleEditCollege = (college: College) => {
    setEditingCollege(college);
    setShowCollegeForm(true);
  };

  const handleViewCollege = (college: College) => {
    // Navigate to college details page
    navigate(`/colleges/${college.id}`);
  };

  // Event management handlers
  const handleCreateEvent = async (eventData: Partial<Event>) => {
    try {
      const { error } = await adminService.createEvent(eventData);
      
      if (error) {
        alert('Failed to create event');
        return;
      }

      alert('Event created successfully!');
      setShowEventForm(false);
      setEditingEvent(null);
      await loadDashboardData();

    } catch (err) {
      alert('Failed to create event');
      console.error('Create event error:', err);
    }
  };

  const handleUpdateEvent = async (eventData: Partial<Event>) => {
    if (!editingEvent) return;

    try {
      const { error } = await adminService.updateEvent(editingEvent.id, eventData);
      
      if (error) {
        alert('Failed to update event');
        return;
      }

      alert('Event updated successfully!');
      setShowEventForm(false);
      setEditingEvent(null);
      await loadDashboardData();

    } catch (err) {
      alert('Failed to update event');
      console.error('Update event error:', err);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleViewEvent = (event: Event) => {
    // Navigate to event details page
    navigate(`/events/${event.id}`);
  };

  // KEAM data management handlers
  const handleCreateKEAMData = async (keamData: Partial<KEAMRankData>) => {
    try {
      const { error } = await adminService.createKEAMData(keamData);
      
      if (error) {
        alert('Failed to create KEAM data');
        return;
      }

      alert('KEAM data created successfully!');
      setShowKeamForm(false);
      setEditingKeam(null);
      await loadDashboardData();

    } catch (err) {
      alert('Failed to create KEAM data');
      console.error('Create KEAM data error:', err);
    }
  };

  const handleUpdateKEAMData = async (keamData: Partial<KEAMRankData>) => {
    if (!editingKeam) return;

    try {
      const { error } = await adminService.updateKEAMData(editingKeam.id, keamData);
      
      if (error) {
        alert('Failed to update KEAM data');
        return;
      }

      alert('KEAM data updated successfully!');
      setShowKeamForm(false);
      setEditingKeam(null);
      await loadDashboardData();

    } catch (err) {
      alert('Failed to update KEAM data');
      console.error('Update KEAM data error:', err);
    }
  };

  const handleEditKEAMData = (keamData: KEAMRankData) => {
    setEditingKeam(keamData);
    setShowKeamForm(true);
  };

  const handleDeleteKEAMData = async (keamId: string) => {
    if (!confirm('Are you sure you want to delete this KEAM data?')) return;

    try {
      const { error } = await adminService.deleteKEAMData(keamId);
      
      if (error) {
        alert('Failed to delete KEAM data');
        return;
      }

      alert('KEAM data deleted successfully!');
      await loadDashboardData();

    } catch (err) {
      alert('Failed to delete KEAM data');
      console.error('Delete KEAM data error:', err);
    }
  };

  // User management handlers
  const handleLoadUsers = async () => {
    try {
      const { data, error } = await adminService.getUsers();
      
      if (error) {
        console.error('Failed to load users:', error);
        return;
      }

      setUsers(data || []);

    } catch (err) {
      console.error('Load users error:', err);
    }
  };

  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      const { error } = await adminService.updateUserRole(userId, role);
      
      if (error) {
        alert('Failed to update user role');
        return;
      }

      alert('User role updated successfully!');
      await handleLoadUsers();

    } catch (err) {
      alert('Failed to update user role');
      console.error('Update user role error:', err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      const { error } = await adminService.deleteUser(userId);
      
      if (error) {
        alert('Failed to delete user');
        return;
      }

      alert('User deleted successfully!');
      await handleLoadUsers();

    } catch (err) {
      alert('Failed to delete user');
      console.error('Delete user error:', err);
    }
  };

  // Analytics and export handlers
  const handleLoadStats = async () => {
    setLoadingStats(true);
    try {
      const { data, error } = await adminService.getDashboardStats();
      
      if (error) {
        console.error('Failed to load stats:', error);
        return;
      }

      setStats(data);

    } catch (err) {
      console.error('Load stats error:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleExportData = async (dataType: string) => {
    try {
      const { data, error } = await adminService.exportData(dataType);
      
      if (error) {
        alert('Failed to export data');
        return;
      }

      // Create and download CSV file
      const csvContent = convertToCSV(data);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataType}_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      alert(`${dataType} data exported successfully!`);

    } catch (err) {
      alert('Failed to export data');
      console.error('Export data error:', err);
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  };

  // Refresh data
  const handleRefreshData = async () => {
    await loadDashboardData();
    await handleLoadStats();
    await handleLoadUsers();
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading admin panel...</h3>
            <p className="text-gray-600">Verifying admin privileges.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => navigate('/')}
                className="bg-[#2563EB] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'colleges', name: 'Colleges', icon: Building2 },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'keam', name: 'KEAM Data', icon: FileText },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'uploads', name: 'File Uploads', icon: Upload },
    { id: 'reviews', name: 'Flagged Reviews', icon: Shield },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.email} • Role: {adminRole?.role}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Debug Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>User Email:</strong> {user?.email}</p>
              <p><strong>Is Logged In:</strong> {isLoggedIn ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p><strong>Admin Role:</strong> {adminRole?.role || 'None'}</p>
              <p><strong>Admin Active:</strong> {adminRole?.is_active ? 'Yes' : 'No'}</p>
              <p><strong>Permissions:</strong> {permissions.join(', ') || 'None'}</p>
            </div>
          </div>
          <button
            onClick={() => {
              console.log('Current user:', user);
              console.log('Admin role:', adminRole);
              console.log('Permissions:', permissions);
            }}
            className="mt-2 bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700"
          >
            Log to Console
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8 border border-gray-100">
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-[#2563EB] text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dashboard Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <Building2 className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">Total Colleges</p>
                      <p className="text-2xl font-bold text-blue-900">{colleges.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <Calendar className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">Total Events</p>
                      <p className="text-2xl font-bold text-green-900">{events.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-600">KEAM Records</p>
                      <p className="text-2xl font-bold text-purple-900">{keamData.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <Shield className="w-8 h-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-red-600">Flagged Reviews</p>
                      <p className="text-2xl font-bold text-red-900">{flaggedReviews.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                  <button
                    onClick={handleRefreshData}
                    className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                    title="Refresh all data"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setShowCollegeForm(true)}
                    className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#2563EB] hover:bg-blue-50 transition-all duration-200"
                  >
                    <Plus className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-gray-600">Add College</span>
                  </button>
                  
                  <button
                    onClick={() => setShowEventForm(true)}
                    className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#2563EB] hover:bg-blue-50 transition-all duration-200"
                  >
                    <Plus className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-gray-600">Add Event</span>
                  </button>
                  
                  <button
                    onClick={() => setShowKeamForm(true)}
                    className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#2563EB] hover:bg-blue-50 transition-all duration-200"
                  >
                    <Plus className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-gray-600">Add KEAM Data</span>
                  </button>
                </div>
              </div>

              {/* Export Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleExportData('colleges')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Colleges
                  </button>
                  <button
                    onClick={() => handleExportData('events')}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Events
                  </button>
                  <button
                    onClick={() => handleExportData('keam')}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export KEAM Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'colleges' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">Manage Colleges</h2>
                <button
                  onClick={() => setShowCollegeForm(true)}
                  className="bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add College
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        College
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {colleges.map((college) => (
                      <tr key={college.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{college.name}</div>
                            <div className="text-sm text-gray-500">{college.college_code}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {college.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {college.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {college.rating}/5
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleViewCollege(college)}
                              className="text-[#2563EB] hover:text-[#1d4ed8]"
                              title="View College"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditCollege(college)}
                              className="text-green-600 hover:text-green-900"
                              title="Edit College"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCollege(college.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete College"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">Manage Events</h2>
                <button
                  onClick={() => setShowEventForm(true)}
                  className="bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{event.title}</div>
                            <div className="text-sm text-gray-500">{event.organizer}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {event.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(event.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {event.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleViewEvent(event)}
                              className="text-[#2563EB] hover:text-[#1d4ed8]"
                              title="View Event"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditEvent(event)}
                              className="text-green-600 hover:text-green-900"
                              title="Edit Event"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'keam' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">KEAM Rank Data</h2>
                <button
                  onClick={() => setShowKeamForm(true)}
                  className="bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add KEAM Data
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Year
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        College
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cutoff Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {keamData.slice(0, 20).map((data) => (
                      <tr key={data.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.college_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.course_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            {data.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.rank_cutoff}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleEditKEAMData(data)}
                              className="text-green-600 hover:text-green-900"
                              title="Edit KEAM Data"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteKEAMData(data.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete KEAM Data"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">Manage Users</h2>
                <button
                  onClick={handleLoadUsers}
                  className="bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Load Users
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Full Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.user_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-[#2563EB] flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                  {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.full_name || 'Not provided'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateUserRole(user.user_id, 'admin')}
                              className="text-blue-600 hover:text-blue-900"
                              title="Make Admin"
                            >
                              <UserPlus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.user_id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete User"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'uploads' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">File Uploads</h2>
              
              {/* Upload Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upload New File</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select File
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2563EB] file:text-white hover:file:bg-[#1d4ed8]"
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleFileUpload('college_data')}
                      disabled={!selectedFile}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Upload as College Data
                    </button>
                    <button
                      onClick={() => handleFileUpload('event_data')}
                      disabled={!selectedFile}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Upload as Event Data
                    </button>
                    <button
                      onClick={() => handleFileUpload('keam_data')}
                      disabled={!selectedFile}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Upload as KEAM Data
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload History */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upload History</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          File Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {fileUploads.map((upload) => (
                        <tr key={upload.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {upload.file_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {upload.upload_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(upload.file_size / 1024 / 1024).toFixed(2)} MB
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              upload.status === 'processed' ? 'bg-green-100 text-green-800' :
                              upload.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {upload.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(upload.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Flagged Reviews</h2>
              
              <div className="space-y-4">
                {flaggedReviews.map((flagged) => (
                  <div key={flagged.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            flagged.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            flagged.status === 'dismissed' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {flagged.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            Flagged by: {flagged.flagged_by}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Reason:</strong> {flagged.reason}
                        </p>
                        {flagged.admin_notes && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Admin Notes:</strong> {flagged.admin_notes}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {new Date(flagged.created_at).toLocaleString()}
                        </p>
                      </div>
                      
                      {flagged.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleResolveFlaggedReview(flagged.id, 'resolved')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleResolveFlaggedReview(flagged.id, 'dismissed')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {flaggedReviews.length === 0 && (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No flagged reviews found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Admin Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> {adminRole?.role}</p>
                    <p><strong>Status:</strong> {adminRole?.is_active ? 'Active' : 'Inactive'}</p>
                    <p><strong>Member Since:</strong> {new Date(adminRole?.created_at || '').toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
                  <div className="space-y-2">
                    {permissions.map((permission) => (
                      <div key={permission} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Components */}
      <CollegeForm
        isOpen={showCollegeForm}
        onClose={() => {
          setShowCollegeForm(false);
          setEditingCollege(null);
        }}
        onSubmit={editingCollege ? handleUpdateCollege : handleCreateCollege}
        college={editingCollege}
      />

      <EventForm
        isOpen={showEventForm}
        onClose={() => {
          setShowEventForm(false);
          setEditingEvent(null);
        }}
        onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
        event={editingEvent}
      />

      <KEAMForm
        isOpen={showKeamForm}
        onClose={() => {
          setShowKeamForm(false);
          setEditingKeam(null);
        }}
        onSubmit={editingKeam ? handleUpdateKEAMData : handleCreateKEAMData}
        keamData={editingKeam}
      />
    </div>
  );
};

export default Admin;