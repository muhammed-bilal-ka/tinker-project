import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Building2, Calendar, FileText, Upload, 
  Settings, BarChart3, Shield, Plus, Edit, Trash2,
  Download, Eye, CheckCircle, XCircle, AlertCircle,
  UserPlus, UserMinus, RefreshCw, BarChart, Search,
  Filter, MoreVertical, Clock, MapPin, Phone, Mail
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
import { useKEAM } from '../contexts/KEAMContext';
import { reviewService } from '../lib/supabase';
import { useReviews } from '../contexts/ReviewsContext';
import { useColleges } from '../contexts/CollegesContext';
import { useEvents } from '../contexts/EventsContext';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data states
  const { colleges, refetch: refetchColleges } = useColleges();
  const { events, refetch: refetchEvents } = useEvents();
  const { keamData, loading: keamLoading, error: keamError, refetch: refetchKEAM } = useKEAM();
  const [fileUploads, setFileUploads] = useState<FileUpload[]>([]);
  const [flaggedReviews, setFlaggedReviews] = useState<FlaggedReview[]>([]);
  const { reviews, refetch: refetchReviews } = useReviews();
  const [reviewStatusFilter, setReviewStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [reviewCollegeFilter, setReviewCollegeFilter] = useState('all');
  const [reviewUserFilter, setReviewUserFilter] = useState('');
  
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
  
  // Loading states for different operations
  const [loadingOperations, setLoadingOperations] = useState<{[key: string]: boolean}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Pagination constants
  const ITEMS_PER_PAGE = 15;

  // Memoized and paginated colleges
  const filteredColleges = useMemo(() => colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.college_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || college.type === filterType;
    return matchesSearch && matchesFilter;
  }), [colleges, searchTerm, filterType]);
  const [collegesPage, setCollegesPage] = useState(1);
  const collegesTotalPages = Math.ceil(filteredColleges.length / ITEMS_PER_PAGE);
  const paginatedColleges = useMemo(() => filteredColleges.slice((collegesPage - 1) * ITEMS_PER_PAGE, collegesPage * ITEMS_PER_PAGE), [filteredColleges, collegesPage]);

  // Memoized and paginated events
  const filteredEvents = useMemo(() => events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || event.category === filterType;
    return matchesSearch && matchesFilter;
  }), [events, searchTerm, filterType]);
  const [eventsPage, setEventsPage] = useState(1);
  const eventsTotalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = useMemo(() => filteredEvents.slice((eventsPage - 1) * ITEMS_PER_PAGE, eventsPage * ITEMS_PER_PAGE), [filteredEvents, eventsPage]);

  // Memoized and paginated KEAM data
  const filteredKEAMData = useMemo(() => keamData.filter(data => {
    const matchesSearch = data.college_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         data.course_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || data.category === filterType;
    return matchesSearch && matchesFilter;
  }), [keamData, searchTerm, filterType]);
  const [keamPage, setKeamPage] = useState(1);
  const keamTotalPages = Math.ceil(filteredKEAMData.length / ITEMS_PER_PAGE);
  const paginatedKEAMData = useMemo(() => filteredKEAMData.slice((keamPage - 1) * ITEMS_PER_PAGE, keamPage * ITEMS_PER_PAGE), [filteredKEAMData, keamPage]);

  // Memoized and paginated reviews
  const filteredAllReviews = useMemo(() => reviews.filter(r => {
    const statusMatch = reviewStatusFilter === 'all' || r.status === reviewStatusFilter;
    const collegeMatch = reviewCollegeFilter === 'all' || r.college_id === reviewCollegeFilter;
    const userMatch = !reviewUserFilter || (r.user_profiles?.full_name?.toLowerCase().includes(reviewUserFilter.toLowerCase()) || r.user_id === reviewUserFilter);
    return statusMatch && collegeMatch && userMatch;
  }), [reviews, reviewStatusFilter, reviewCollegeFilter, reviewUserFilter]);
  const [reviewsPage, setReviewsPage] = useState(1);
  const reviewsTotalPages = Math.ceil(filteredAllReviews.length / ITEMS_PER_PAGE);
  const paginatedAllReviews = useMemo(() => filteredAllReviews.slice((reviewsPage - 1) * ITEMS_PER_PAGE, reviewsPage * ITEMS_PER_PAGE), [filteredAllReviews, reviewsPage]);

  // Reset page when filters/search change
  useEffect(() => { setCollegesPage(1); }, [searchTerm, filterType]);
  useEffect(() => { setEventsPage(1); }, [searchTerm, filterType]);
  useEffect(() => { setKeamPage(1); }, [searchTerm, filterType]);
  useEffect(() => { setReviewsPage(1); }, [reviewStatusFilter, reviewCollegeFilter, reviewUserFilter]);

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
        // await loadDashboardData(); // Removed as per edit hint
        
      } catch (err) {
        setError('Failed to verify admin status');
        console.error('Admin status check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [isLoggedIn, user]);

  // Remove handleRefreshData, loadDashboardData, and all calls to them, as well as any refresh buttons in the UI. Use context providers for real-time updates.

  const handleFileUpload = async (uploadType: string) => {
    if (!selectedFile || !user) return;

    try {
      setLoadingOperations(prev => ({ ...prev, fileUpload: true }));
      
      let result;
      
      if (uploadType === 'college_data') {
        result = await adminService.processCollegeFile(selectedFile, user.id);
      } else if (uploadType === 'keam_data') {
        result = await adminService.processKEAMFile(selectedFile, user.id);
      } else {
        // Handle other file types (event_data, other)
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
          alert('Failed to upload file: ' + error.message);
          return;
        }

        alert('File uploaded successfully!');
        setSelectedFile(null);
        // await loadDashboardData(); // Removed as per edit hint
        return;
      }

      if (result.success) {
        alert(`File processed successfully!\n\n${result.message}\n\nProcessed: ${result.stats?.processedRecords} records\nFailed: ${result.stats?.failedRecords} records`);
        
        // If KEAM data was processed, run predictions
        if (uploadType === 'keam_data' && result.data && result.data.length > 0) {
          const categories = [...new Set(result.data.map((item: any) => item.category))];
          if (categories.length > 0) {
            const sampleRank = 1000; // Example rank for demonstration
            const predictionResult = await adminService.predictColleges(sampleRank, categories[0]);
            if (predictionResult.data) {
              console.log('KEAM Predictions:', predictionResult.data);
              alert(`KEAM Predictor updated with new data!\n\nSample prediction for rank ${sampleRank} in ${categories[0]} category:\nHigh chance: ${predictionResult.data.high_chance.length} colleges\nMedium chance: ${predictionResult.data.medium_chance.length} colleges`);
            }
          }
        }
      } else {
        alert(`File processing failed:\n\n${result.message}\n\nErrors:\n${result.errors?.join('\n')}`);
      }

      setSelectedFile(null);
      // await loadDashboardData(); // Removed as per edit hint

    } catch (err) {
      alert('Failed to process file: ' + (err as Error).message);
      console.error('File processing error:', err);
    } finally {
      setLoadingOperations(prev => ({ ...prev, fileUpload: false }));
    }
  };

  const handleDeleteFileUpload = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file upload record? This will only remove the upload record, not the processed data.')) return;

    try {
      setLoadingOperations(prev => ({ ...prev, [`delete-file-${fileId}`]: true }));
      
      const { error } = await adminService.deleteFileUpload(fileId);
      
      if (error) {
        alert('Failed to delete file upload: ' + error.message);
        return;
      }

      alert('File upload record deleted successfully!');
      // await loadDashboardData(); // Removed as per edit hint

    } catch (err) {
      alert('Failed to delete file upload: ' + (err as Error).message);
      console.error('Delete file upload error:', err);
    } finally {
      setLoadingOperations(prev => ({ ...prev, [`delete-file-${fileId}`]: false }));
    }
  };

  const handleDeleteCollege = async (collegeId: string) => {
    if (!confirm('Are you sure you want to delete this college? This action cannot be undone.')) return;

    try {
      setLoadingOperations(prev => ({ ...prev, [`delete-college-${collegeId}`]: true }));
      
      const { error } = await adminService.deleteCollege(collegeId);
      
      if (error) {
        alert('Failed to delete college: ' + error.message);
        return;
      }

      alert('College deleted successfully!');
      await refetchColleges();

    } catch (err) {
      alert('Failed to delete college: ' + (err as Error).message);
      console.error('Delete college error:', err);
    } finally {
      setLoadingOperations(prev => ({ ...prev, [`delete-college-${collegeId}`]: false }));
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;

    try {
      setLoadingOperations(prev => ({ ...prev, [`delete-event-${eventId}`]: true }));
      
      const { error } = await adminService.deleteEvent(eventId);
      
      if (error) {
        alert('Failed to delete event: ' + error.message);
        return;
      }

      alert('Event deleted successfully!');
      // await loadDashboardData(); // Removed as per edit hint

    } catch (err) {
      alert('Failed to delete event: ' + (err as Error).message);
      console.error('Delete event error:', err);
    } finally {
      setLoadingOperations(prev => ({ ...prev, [`delete-event-${eventId}`]: false }));
    }
  };

  const handleResolveFlaggedReview = async (reviewId: string, status: string) => {
    if (!user) return;

    try {
      setLoadingOperations(prev => ({ ...prev, [`resolve-review-${reviewId}`]: true }));
      
      const updateData = {
        status: status as any,
        resolved_by: user.id,
        resolved_at: new Date().toISOString()
      };

      const { error } = await adminService.updateFlaggedReview(reviewId, updateData);
      
      if (error) {
        alert('Failed to update review status: ' + error.message);
        return;
      }

      alert('Review status updated successfully!');
      // await loadDashboardData(); // Removed as per edit hint

    } catch (err) {
      alert('Failed to update review status: ' + (err as Error).message);
      console.error('Update review error:', err);
    } finally {
      setLoadingOperations(prev => ({ ...prev, [`resolve-review-${reviewId}`]: false }));
    }
  };

  // College management handlers
  const handleCreateCollege = async (collegeData: Partial<College>) => {
    try {
      setLoadingOperations(prev => ({ ...prev, createCollege: true }));
      
      const { error } = await adminService.createCollege(collegeData);
      
      if (error) {
        alert('Failed to create college: ' + error.message);
        return;
      }

      alert('College created successfully!');
      setShowCollegeForm(false);
      setEditingCollege(null);
      await refetchColleges();

    } catch (err) {
      alert('Failed to create college: ' + (err as Error).message);
      console.error('Create college error:', err);
    } finally {
      setLoadingOperations(prev => ({ ...prev, createCollege: false }));
    }
  };

  const handleUpdateCollege = async (collegeData: Partial<College>) => {
    if (!editingCollege) return;

    try {
      setLoadingOperations(prev => ({ ...prev, updateCollege: true }));
      
      const { error } = await adminService.updateCollege(editingCollege.id, collegeData);
      
      if (error) {
        alert('Failed to update college: ' + error.message);
        return;
      }

      alert('College updated successfully!');
      setShowCollegeForm(false);
      setEditingCollege(null);
      await refetchColleges();

    } catch (err) {
      alert('Failed to update college: ' + (err as Error).message);
      console.error('Update college error:', err);
    } finally {
      setLoadingOperations(prev => ({ ...prev, updateCollege: false }));
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
      setLoadingOperations(prev => ({ ...prev, createEvent: true }));
      
      const { error } = await adminService.createEvent(eventData);
      
      if (error) {
        alert('Failed to create event: ' + error.message);
        return;
      }

      alert('Event created successfully!');
      setShowEventForm(false);
      setEditingEvent(null);
      // await loadDashboardData(); // Removed as per edit hint

    } catch (err) {
      alert('Failed to create event: ' + (err as Error).message);
      console.error('Create event error:', err);
    } finally {
      setLoadingOperations(prev => ({ ...prev, createEvent: false }));
    }
  };

  const handleUpdateEvent = async (eventData: Partial<Event>) => {
    if (!editingEvent) return;

    try {
      setLoadingOperations(prev => ({ ...prev, updateEvent: true }));
      
      const { error } = await adminService.updateEvent(editingEvent.id, eventData);
      
      if (error) {
        alert('Failed to update event: ' + error.message);
        return;
      }

      alert('Event updated successfully!');
      setShowEventForm(false);
      setEditingEvent(null);
      await refetchEvents(); // Force refresh after update
    } catch (err) {
      alert('Failed to update event: ' + (err as Error).message);
      console.error('Update event error:', err);
    } finally {
      setLoadingOperations(prev => ({ ...prev, updateEvent: false }));
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
      setLoadingOperations(prev => ({ ...prev, createKEAM: true }));
      
      const { error } = await adminService.createKEAMData(keamData);
      
      if (error) {
        alert('Failed to create KEAM data: ' + error.message);
        return;
      }

      alert('KEAM data created successfully!');
      setShowKeamForm(false);
      setEditingKeam(null);
      await refetchKEAM();

    } catch (err) {
      alert('Failed to create KEAM data: ' + (err as Error).message);
      console.error('Create KEAM data error:', err);
    } finally {
      setLoadingOperations(prev => ({ ...prev, createKEAM: false }));
    }
  };

  const handleUpdateKEAMData = async (keamData: Partial<KEAMRankData>) => {
    if (!editingKeam) return;

    try {
      setLoadingOperations(prev => ({ ...prev, updateKEAM: true }));
      
      const { error } = await adminService.updateKEAMData(editingKeam.id, keamData);
      
      if (error) {
        alert('Failed to update KEAM data: ' + error.message);
        return;
      }

      alert('KEAM data updated successfully!');
      setShowKeamForm(false);
      setEditingKeam(null);
      await refetchKEAM();

    } catch (err) {
      alert('Failed to update KEAM data: ' + (err as Error).message);
      console.error('Update KEAM data error:', err);
    } finally {
      setLoadingOperations(prev => ({ ...prev, updateKEAM: false }));
    }
  };

  const handleEditKEAMData = (keamData: KEAMRankData) => {
    setEditingKeam(keamData);
    setShowKeamForm(true);
  };

  const handleDeleteKEAMData = async (keamId: string) => {
    if (!confirm('Are you sure you want to delete this KEAM data? This action cannot be undone.')) return;

    try {
      setLoadingOperations(prev => ({ ...prev, [`delete-keam-${keamId}`]: true }));
      
      const { error } = await adminService.deleteKEAMData(keamId);
      
      if (error) {
        alert('Failed to delete KEAM data: ' + error.message);
        return;
      }

      alert('KEAM data deleted successfully!');
      await refetchKEAM();

    } catch (err) {
      alert('Failed to delete KEAM data: ' + (err as Error).message);
      console.error('Delete KEAM data error:', err);
    } finally {
      setLoadingOperations(prev => ({ ...prev, [`delete-keam-${keamId}`]: false }));
    }
  };

  // User management handlers
  const handleLoadUsers = async () => {
    try {
      setLoadingOperations(prev => ({ ...prev, loadUsers: true }));
      
      const { data, error } = await adminService.getUsers();
      
      if (error) {
        console.error('Failed to load users:', error);
        alert('Failed to load users: ' + error.message);
        return;
      }

      setUsers(data || []);

    } catch (err) {
      console.error('Load users error:', err);
      alert('Failed to load users: ' + (err as Error).message);
    } finally {
      setLoadingOperations(prev => ({ ...prev, loadUsers: false }));
    }
  };

  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      setLoadingOperations(prev => ({ ...prev, [`update-user-${userId}`]: true }));
      
      const { error } = await adminService.updateUserRole(userId, role);
      
      if (error) {
        alert('Failed to update user role: ' + error.message);
        return;
      }

      alert('User role updated successfully!');
      await handleLoadUsers();

    } catch (err) {
      alert('Failed to update user role: ' + (err as Error).message);
      console.error('Update user role error:', err);
    } finally {
      setLoadingOperations(prev => ({ ...prev, [`update-user-${userId}`]: false }));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      setLoadingOperations(prev => ({ ...prev, [`delete-user-${userId}`]: true }));
      
      const { error } = await adminService.deleteUser(userId);
      
      if (error) {
        alert('Failed to delete user: ' + error.message);
        return;
      }

      alert('User deleted successfully!');
      await handleLoadUsers();

    } catch (err) {
      alert('Failed to delete user: ' + (err as Error).message);
      console.error('Delete user error:', err);
    } finally {
      setLoadingOperations(prev => ({ ...prev, [`delete-user-${userId}`]: false }));
    }
  };

  // Analytics and export handlers
  const handleLoadStats = async () => {
    setLoadingStats(true);
    try {
      const { data, error } = await adminService.getDashboardStats();
      
      if (error) {
        console.error('Failed to load stats:', error);
        alert('Failed to load stats: ' + error.message);
        return;
      }

      setStats(data);

    } catch (err) {
      console.error('Load stats error:', err);
      alert('Failed to load stats: ' + (err as Error).message);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleExportData = async (dataType: string) => {
    try {
      setLoadingOperations(prev => ({ ...prev, [`export-${dataType}`]: true }));
      
      const { data, error } = await adminService.exportData(dataType);
      
      if (error) {
        alert('Failed to export data: ' + error.message);
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
      alert('Failed to export data: ' + (err as Error).message);
      console.error('Export data error:', err);
    } finally {
      setLoadingOperations(prev => ({ ...prev, [`export-${dataType}`]: false }));
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
  // handleRefreshData is removed as per edit hint.

  // Filter and search functions
  const handleAcceptReview = async (reviewId: string) => {
    await reviewService.updateReviewStatus(reviewId, 'accepted');
    await refetchReviews();
  };
  const handleRejectReview = async (reviewId: string) => {
    await reviewService.updateReviewStatus(reviewId, 'rejected');
    await refetchReviews();
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

  console.log('Admin reviews:', reviews);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'colleges', name: 'Colleges', icon: Building2 },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'keam', name: 'KEAM Data', icon: FileText },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'uploads', name: 'File Uploads', icon: Upload },
    { id: 'reviews', name: 'Flagged Reviews', icon: Shield },
    { id: 'all-reviews', name: 'All Reviews', icon: Eye },
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

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8 border border-gray-100 overflow-x-auto">
          <nav className="flex space-x-1 min-w-[500px] sm:min-w-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
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

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search colleges, events, or KEAM data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-auto"
              >
                <option value="all">All Types</option>
                <option value="engineering">Engineering</option>
                <option value="medical">Medical</option>
                <option value="arts">Arts</option>
                <option value="commerce">Commerce</option>
                <option value="science">Science</option>
                <option value="academic">Academic</option>
                <option value="cultural">Cultural</option>
                <option value="sports">Sports</option>
                <option value="technical">Technical</option>
                <option value="workshop">Workshop</option>
              </select>
            </div>
          </div>
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
                  {/* Refresh button removed as per edit hint */}
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
                <table className="min-w-[600px] sm:min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affiliation</th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedColleges.map((college) => (
                      <tr key={college.id} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">{college.name}</td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">{college.college_code}</td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">{college.type}</td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">{college.location}</td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">{college.rating}/5</td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">{college.affiliation}</td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">{college.courses_offered?.join(', ')}</td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                            <button onClick={() => handleViewCollege(college)} className="text-[#2563EB] hover:text-[#1d4ed8]" title="View College"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => handleEditCollege(college)} className="text-green-600 hover:text-green-900" title="Edit College"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteCollege(college.id)} disabled={loadingOperations[`delete-college-${college.id}`]} className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed" title="Delete College">{loadingOperations[`delete-college-${college.id}`] ? (<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>) : (<Trash2 className="w-4 h-4" />)}</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                {collegesTotalPages > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    <button onClick={() => setCollegesPage(p => Math.max(1, p - 1))} disabled={collegesPage === 1} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Prev</button>
                    <span className="px-3 py-1">Page {collegesPage} of {collegesTotalPages}</span>
                    <button onClick={() => setCollegesPage(p => Math.min(collegesTotalPages, p + 1))} disabled={collegesPage === collegesTotalPages} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Next</button>
                  </div>
                )}
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organizer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{event.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(event.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{event.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{event.organizer}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{event.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button onClick={() => handleViewEvent(event)} className="text-[#2563EB] hover:text-[#1d4ed8]" title="View Event"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => handleEditEvent(event)} className="text-green-600 hover:text-green-900" title="Edit Event"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteEvent(event.id)} className="text-red-600 hover:text-red-900" title="Delete Event"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                {eventsTotalPages > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    <button onClick={() => setEventsPage(p => Math.max(1, p - 1))} disabled={eventsPage === 1} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Prev</button>
                    <span className="px-3 py-1">Page {eventsPage} of {eventsTotalPages}</span>
                    <button onClick={() => setEventsPage(p => Math.min(eventsTotalPages, p + 1))} disabled={eventsPage === eventsTotalPages} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Next</button>
                  </div>
                )}
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
                    {paginatedKEAMData.map((data) => (
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
                {/* Pagination Controls */}
                {keamTotalPages > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    <button onClick={() => setKeamPage(p => Math.max(1, p - 1))} disabled={keamPage === 1} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Prev</button>
                    <span className="px-3 py-1">Page {keamPage} of {keamTotalPages}</span>
                    <button onClick={() => setKeamPage(p => Math.min(keamTotalPages, p + 1))} disabled={keamPage === keamTotalPages} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Next</button>
                  </div>
                )}
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
              <h2 className="text-2xl font-semibold text-gray-900">File Uploads & Processing</h2>
              
              {/* Upload Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-blue-600" />
                  Upload & Process Files
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select File (CSV, Excel, PDF)
                    </label>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls,.pdf"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2563EB] file:text-white hover:file:bg-[#1d4ed8]"
                    />
                    {selectedFile && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        {selectedFile.name.toLowerCase().endsWith('.pdf') && (
                          <span className="ml-2 text-blue-600 font-medium">📄 PDF - AI Processing Enabled</span>
                        )}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleFileUpload('college_data')}
                      disabled={!selectedFile || loadingOperations.fileUpload}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                    >
                      {loadingOperations.fileUpload ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Building2 className="w-4 h-4 mr-2" />
                      )}
                      Process as College Data
                    </button>
                    <button
                      onClick={() => handleFileUpload('event_data')}
                      disabled={!selectedFile || loadingOperations.fileUpload}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                    >
                      {loadingOperations.fileUpload ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Calendar className="w-4 h-4 mr-2" />
                      )}
                      Process as Event Data
                    </button>
                    <button
                      onClick={() => handleFileUpload('keam_data')}
                      disabled={!selectedFile || loadingOperations.fileUpload}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                    >
                      {loadingOperations.fileUpload ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <FileText className="w-4 h-4 mr-2" />
                      )}
                      Process as KEAM Data
                    </button>
                  </div>
                  
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">📋 File Processing Features:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>College Data:</strong> Auto-detects and maps college information with AI-enhanced field recognition</li>
                      <li>• <strong>KEAM Data:</strong> Intelligent parsing of course-wise cutoff ranks with trend analysis</li>
                      <li>• <strong>Event Data:</strong> Structured event information processing</li>
                      <li>• <strong>PDF Processing:</strong> Advanced AI-powered text extraction and intelligent data parsing from PDF files</li>
                      <li>• <strong>AI Integration:</strong> Automatic field generation, data validation, and pattern recognition</li>
                      <li>• <strong>Multi-Format Support:</strong> CSV, Excel, and PDF files with intelligent format detection</li>
                    </ul>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDeleteFileUpload(upload.id)}
                              disabled={loadingOperations[`delete-file-${upload.id}`]}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete Upload"
                            >
                              {loadingOperations[`delete-file-${upload.id}`] ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
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

          {activeTab === 'all-reviews' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">All Reviews</h2>
              <div className="flex flex-wrap gap-4 mb-4">
                <select value={reviewStatusFilter} onChange={e => setReviewStatusFilter(e.target.value as any)} className="px-3 py-2 border rounded">
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select value={reviewCollegeFilter} onChange={e => setReviewCollegeFilter(e.target.value)} className="px-3 py-2 border rounded">
                  <option value="all">All Colleges</option>
                  {colleges.map(college => (
                    <option key={college.id} value={college.id}>{college.name}</option>
                  ))}
                </select>
                <input type="text" value={reviewUserFilter} onChange={e => setReviewUserFilter(e.target.value)} placeholder="Filter by user name or ID" className="px-3 py-2 border rounded" />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedAllReviews.map(review => (
                      <tr key={review.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{colleges.find(c => c.id === review.college_id)?.name || review.college_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {review.user_profiles?.full_name || review.user_id}
                          {review.user_profiles?.profession && (
                            <span className="block text-xs text-gray-500">{review.user_profiles.profession}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{review.rating}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{review.review_text}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${review.status === 'accepted' ? 'bg-green-100 text-green-800' : review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{review.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {review.status === 'pending' && (
                            <>
                              <button onClick={() => handleAcceptReview(review.id)} className="text-green-600 hover:text-green-900 mr-2">Accept</button>
                              <button onClick={() => handleRejectReview(review.id)} className="text-red-600 hover:text-red-900">Reject</button>
                            </>
                          )}
                          {review.status === 'rejected' && (
                            <button onClick={() => handleAcceptReview(review.id)} className="text-green-600 hover:text-green-900">Accept</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                {reviewsTotalPages > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    <button onClick={() => setReviewsPage(p => Math.max(1, p - 1))} disabled={reviewsPage === 1} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Prev</button>
                    <span className="px-3 py-1">Page {reviewsPage} of {reviewsTotalPages}</span>
                    <button onClick={() => setReviewsPage(p => Math.min(reviewsTotalPages, p + 1))} disabled={reviewsPage === reviewsTotalPages} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Next</button>
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