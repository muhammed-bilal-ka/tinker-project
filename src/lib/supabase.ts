import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5174'

// Create Supabase client with additional options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // Set the site URL to match our application URL
    site_url: appUrl
  }
})

// Types for our database tables
export interface College {
  admission_info: { requirements: string; process: string; fees: string }
  contact_info: { phone: string; email: string; website: string }
  id: string
  college_code: string
  name: string
  type: string
  location?: string
  website?: string
  description?: string
  established_year?: number
  affiliation?: string
  courses_offered: string[]
  facilities: string[]
  rating: number
  total_seats: number
  fees_range?: string
  placement_percentage: number
  contact_phone?: string
  contact_email?: string
  address?: string
  latitude?: number
  longitude?: number
  image_url?: string
  created_at: string
  updated_at: string
}

// User Profile interface
export interface UserProfile {
  id: string
  user_id: string
  full_name: string
  phone: string
  city: string
  pincode: string
  profession: string
  qualification: string
  ug_college?: string
  ug_branch?: string
  ug_year?: string
  pg_college?: string
  pg_branch?: string
  pg_year?: string
  consent: boolean
  created_at: string
  updated_at: string
  avatar_url?: string
}

// Review interface
export interface Review {
  id: string
  college_id: string
  user_id: string
  rating: number
  review_text: string
  created_at: string
  user_profiles: {
    full_name: string
    profession?: string
    avatar_url?: string
    username?: string
  } | null // user_profiles can be null if the join doesn't find a match
  status: 'pending' | 'accepted' | 'rejected'
}

// Event interfaces
export interface Event {
  max_participants: number
  registration_required: boolean
  contact_info: { phone: string; email: string }
  id: string
  title: string
  description: string
  full_description?: string
  date: string
  end_date?: string
  time?: string
  end_time?: string
  location: string
  venue: string
  address?: string
  category: string
  image_url?: string
  attendees_limit?: number
  current_attendees: number
  price: string
  organizer: string
  organizer_image_url?: string
  registration_link?: string
  website?: string
  email?: string
  phone?: string
  featured: boolean
  tags: string[]
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface EventSpeaker {
  id: string
  event_id: string
  name: string
  title?: string
  company?: string
  image_url?: string
  topic?: string
  bio?: string
  created_at: string
}

export interface EventAgenda {
  id: string
  event_id: string
  time_slot: string
  title: string
  description?: string
  speaker_name?: string
  duration_minutes?: number
  order_index: number
  created_at: string
}

export interface EventSponsor {
  id: string
  event_id: string
  name: string
  logo_url?: string
  website?: string
  sponsorship_level: string
  created_at: string
}

export interface EventRegistration {
  id: string
  event_id: string
  user_id: string
  registration_date: string
  status: 'registered' | 'attended' | 'cancelled'
  notes?: string
}

// Admin interfaces
export interface AdminRole {
  id: string
  user_id: string
  role: 'admin' | 'super_admin'
  permissions: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface KEAMRankData {
  duration: string
  fees: number
  id: string
  year: number
  college_code: string
  college_name: string
  course_name: string
  category: string
  rank_cutoff: number
  total_seats?: number
  filled_seats?: number
  created_at: string
}

export interface KEAMPrediction {
  id: string
  user_id?: string
  keam_rank: number
  category: string
  prediction_data: {
    high_chance: Array<{
      college_name: string
      course_name: string
      category: string
      confidence: number
    }>
    medium_chance: Array<{
      college_name: string
      course_name: string
      category: string
      confidence: number
    }>
    low_chance: Array<{
      college_name: string
      course_name: string
      category: string
      confidence: number
    }>
  }
  created_at: string
}

export interface FileUpload {
  id: string
  admin_id: string
  file_name: string
  file_type: string
  file_size: number
  file_url: string
  upload_type: 'college_data' | 'event_data' | 'keam_data' | 'other'
  status: 'uploaded' | 'processing' | 'processed' | 'failed'
  metadata: Record<string, any>
  created_at: string
}

export interface FlaggedReview {
  id: string
  review_id: string
  flagged_by: string
  reason: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  admin_notes?: string
  resolved_by?: string
  resolved_at?: string
  created_at: string
}
/*
// This is how we get reviews from the database
export const reviewService = {
  async getReviews(collegeId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        college_id,
        user_id,
        rating,
        review_text,
        created_at,
        user_profiles:user_id (
          full_name,
          avatar_url,
          username
        )
      `)
      .eq('college_id', collegeId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Oops! Error getting reviews:', error)
      throw error
    }
    
    return data as Review[]
  }
}*/

// College service functions
export const collegeService = {
  // Get all colleges with optional filtering
  async getColleges(filters?: {
    type?: string
    location?: string
    search?: string
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('colleges')
      .select('*')
      .order('rating', { ascending: false })

    if (filters?.type && filters.type !== 'all') {
      query = query.eq('type', filters.type)
    }

    if (filters?.location && filters.location !== 'all') {
      query = query.ilike('location', `%${filters.location}%`)
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,location.ilike.%${filters.search}%,courses_offered.cs.["${filters.search}"]`)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching colleges:', error)
      return { data: [], error }
    }

    return { data: data as College[], error: null }
  },

  // Get a single college by ID
  async getCollegeById(id: string) {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching college:', error)
      return { data: null, error }
    }

    return { data: data as College, error: null }
  },

  // Get colleges by type
  async getCollegesByType(type: string) {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('type', type)
      .order('rating', { ascending: false })

    if (error) {
      console.error('Error fetching colleges by type:', error)
      return { data: [], error }
    }

    return { data: data as College[], error: null }
  },

  // Search colleges
  async searchColleges(searchTerm: string) {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('rating', { ascending: false })

    if (error) {
      console.error('Error searching colleges:', error)
      return { data: [], error }
    }

    return { data: data as College[], error: null }
  },

  // Get college statistics
  async getCollegeStats() {
    const { data, error } = await supabase
      .from('colleges')
      .select('type, location')

    if (error) {
      console.error('Error fetching college stats:', error)
      return { data: null, error }
    }

    const stats = {
      total: data.length,
      byType: data.reduce((acc: Record<string, number>, college) => {
        acc[college.type] = (acc[college.type] || 0) + 1
        return acc
      }, {}),
      byLocation: data.reduce((acc: Record<string, number>, college) => {
        if (college.location) {
          acc[college.location] = (acc[college.location] || 0) + 1
        }
        return acc
      }, {})
    }

    return { data: stats, error: null }
  }
}

// User Profile service functions
export const profileService = {
  async createProfile(profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profileData])
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      return { data: null, error }
    }

    return { data: data as UserProfile, error: null }
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return { data: null, error }
    }

    return { data: data as UserProfile, error: null }
  },

  async updateProfile(userId: string, profileData: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(profileData)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return { data: null, error }
    }

    return { data: data as UserProfile, error: null }
  }
}

// Review service functions
export const reviewService = {
  async getReviews(collegeId?: string, status?: string) {
    let query = supabase
      .from('reviews')
      .select(`*, user_profiles(full_name, profession, avatar_url, username)`)
      .order('created_at', { ascending: false });
    if (collegeId) query = query.eq('college_id', collegeId);
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching reviews:', error);
      return { data: [], error };
    }
    return { data: data as Review[], error: null };
  },
  async createReview(reviewData: Omit<Review, 'id' | 'created_at' | 'user_profiles' | 'status'>) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ ...reviewData, status: 'pending' }])
      .select()
      .single();
    if (error) {
      console.error('Error creating review:', error);
      return { data: null, error };
    }
    return { data: data as Review, error: null };
  },
  async updateReviewStatus(reviewId: string, status: 'pending' | 'accepted' | 'rejected') {
    const { data, error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', reviewId)
      .select()
      .maybeSingle(); // changed from .single() to .maybeSingle()
    if (error) {
      console.error('Error updating review status:', error);
      return { data: null, error };
    }
    return { data: data as Review, error: null };
  },

  async getUserReview(collegeId: string, userId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('college_id', collegeId)
      .eq('user_id', userId)
      .maybeSingle(); // was .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user review:', error)
      return { data: null, error }
    }

    return { data: data as Review | null, error: null }
  },
};

// Event service functions
export const eventService = {
  // Get all events with optional filtering
  async getEvents(filters?: {
    category?: string
    location?: string
    search?: string
    featured?: boolean
    status?: string
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }

    if (filters?.location && filters.location !== 'all') {
      query = query.ilike('location', `%${filters.location}%`)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location.ilike.%${filters.search}%`)
    }

    if (filters?.featured) {
      query = query.eq('featured', true)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching events:', error)
      return { data: [], error }
    }

    return { data: data as Event[], error: null }
  },

  // Get a single event by ID with all related data
  async getEventById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching event:', error)
      return { data: null, error }
    }

    return { data: data as Event, error: null }
  },

  // Get event speakers
  async getEventSpeakers(eventId: string) {
    const { data, error } = await supabase
      .from('event_speakers')
      .select('*')
      .eq('event_id', eventId)
      .order('name')

    if (error) {
      console.error('Error fetching event speakers:', error)
      return { data: [], error }
    }

    return { data: data as EventSpeaker[], error: null }
  },

  // Get event agenda
  async getEventAgenda(eventId: string) {
    const { data, error } = await supabase
      .from('event_agenda')
      .select('*')
      .eq('event_id', eventId)
      .order('order_index')

    if (error) {
      console.error('Error fetching event agenda:', error)
      return { data: [], error }
    }

    return { data: data as EventAgenda[], error: null }
  },

  // Get event sponsors
  async getEventSponsors(eventId: string) {
    const { data, error } = await supabase
      .from('event_sponsors')
      .select('*')
      .eq('event_id', eventId)
      .order('sponsorship_level')

    if (error) {
      console.error('Error fetching event sponsors:', error)
      return { data: [], error }
    }

    return { data: data as EventSponsor[], error: null }
  },

  // Register user for an event
  async registerForEvent(eventId: string, userId: string, notes?: string) {
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([{
        event_id: eventId,
        user_id: userId,
        notes
      }])
      .select()
      .single()

    if (error) {
      console.error('Error registering for event:', error)
      return { data: null, error }
    }

    return { data: data as EventRegistration, error: null }
  },

  // Check if user is registered for an event
  async checkUserRegistration(eventId: string, userId: string) {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking user registration:', error)
      return { data: null, error }
    }

    return { data: data as EventRegistration | null, error: null }
  },

  // Get user's event registrations
  async getUserRegistrations(userId: string) {
    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events(*)
      `)
      .eq('user_id', userId)
      .order('registration_date', { ascending: false })

    if (error) {
      console.error('Error fetching user registrations:', error)
      return { data: [], error }
    }

    return { data: data as (EventRegistration & { events: Event })[], error: null }
  },

  // Search events
  async searchEvents(searchTerm: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,organizer.ilike.%${searchTerm}%`)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error searching events:', error)
      return { data: [], error }
    }

    return { data: data as Event[], error: null }
  },

  // Get event statistics
  async getEventStats() {
    const { data, error } = await supabase
      .from('events')
      .select('category, location, status')

    if (error) {
      console.error('Error fetching event stats:', error)
      return { data: null, error }
    }

    const stats = {
      total: data.length,
      byCategory: data.reduce((acc: Record<string, number>, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1
        return acc
      }, {}),
      byLocation: data.reduce((acc: Record<string, number>, event) => {
        acc[event.location] = (acc[event.location] || 0) + 1
        return acc
      }, {}),
      byStatus: data.reduce((acc: Record<string, number>, event) => {
        acc[event.status] = (acc[event.status] || 0) + 1
        return acc
      }, {})
    }

    return { data: stats, error: null }
  }
}

// Admin service functions
export const adminService = {
  // Check if user is admin
  async checkAdminStatus(userId: string) {
    try {
      // First try the direct query
      const { data, error } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error)
        return { data: null, error }
      }

      return { data: data as AdminRole | null, error: null }
    } catch (err) {
      console.error('Exception in checkAdminStatus:', err)
      return { data: null, error: err as Error }
    }
  },

  // Get admin permissions
  async getAdminPermissions(userId: string) {
    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('permissions')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error getting admin permissions:', error)
        return { data: [], error }
      }

      return { data: data?.permissions || [], error: null }
    } catch (err) {
      console.error('Exception in getAdminPermissions:', err)
      return { data: [], error: err as Error }
    }
  },

  // Alternative admin check method using RPC
  async checkAdminStatusRPC(userId: string) {
    try {
      const { data, error } = await supabase
        .rpc('is_admin', { user_uuid: userId })

      if (error) {
        console.error('Error checking admin status via RPC:', error)
        return { data: false, error }
      }

      return { data: data || false, error: null }
    } catch (err) {
      console.error('Exception in checkAdminStatusRPC:', err)
      return { data: false, error: err as Error }
    }
  },

  // Manage colleges (admin only)
  async createCollege(collegeData: Omit<College, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('colleges')
      .insert([collegeData])
      .select()
      .single()

    if (error) {
      console.error('Error creating college:', error)
      return { data: null, error }
    }

    return { data: data as College, error: null }
  },

  async updateCollege(id: string, collegeData: Partial<College>) {
    const { data, error } = await supabase
      .from('colleges')
      .update(collegeData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating college:', error)
      return { data: null, error }
    }

    return { data: data as College, error: null }
  },

  async deleteCollege(id: string) {
    const { error } = await supabase
      .from('colleges')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting college:', error)
      return { error }
    }

    return { error: null }
  },

  // Manage events (admin only)
  async createEvent(eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single()

    if (error) {
      console.error('Error creating event:', error)
      return { data: null, error }
    }

    return { data: data as Event, error: null }
  },

  async updateEvent(id: string, eventData: Partial<Event>) {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating event:', error)
      return { data: null, error }
    }

    return { data: data as Event, error: null }
  },

  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting event:', error)
      return { error }
    }

    return { error: null }
  },

  // File upload management
  async uploadFile(fileData: Omit<FileUpload, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('file_uploads')
      .insert([fileData])
      .select()
      .single()

    if (error) {
      console.error('Error uploading file:', error)
      return { data: null, error }
    }

    return { data: data as FileUpload, error: null }
  },

  async getFileUploads(adminId: string) {
    const { data, error } = await supabase
      .from('file_uploads')
      .select('*')
      .eq('admin_id', adminId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching file uploads:', error)
      return { data: [], error }
    }

    return { data: data as FileUpload[], error: null }
  },

  // Flagged reviews management
  async getFlaggedReviews() {
    try {
      // First try with joins
      const { data, error } = await supabase
        .from('flagged_reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching flagged reviews:', error)
        return { data: [], error }
      }

      return { data: data as FlaggedReview[], error: null }
    } catch (err) {
      console.error('Exception in getFlaggedReviews:', err)
      return { data: [], error: err as Error }
    }
  },

  async updateFlaggedReview(id: string, updateData: Partial<FlaggedReview>) {
    const { data, error } = await supabase
      .from('flagged_reviews')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating flagged review:', error)
      return { data: null, error }
    }

    return { data: data as FlaggedReview, error: null }
  }
}

// KEAM Prediction service functions
export const keamService = {
  // Get KEAM rank data
  async getKEAMRankData(filters?: {
    year?: number
    college_code?: string
    category?: string
    course_name?: string
  }) {
    let query = supabase
      .from('keam_rank_data')
      .select('*')
      .order('year', { ascending: false })

    if (filters?.year) {
      query = query.eq('year', filters.year)
    }

    if (filters?.college_code) {
      query = query.eq('college_code', filters.college_code)
    }

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.course_name) {
      query = query.ilike('course_name', `%${filters.course_name}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching KEAM rank data:', error)
      return { data: [], error }
    }

    return { data: data as KEAMRankData[], error: null }
  },

  // Create KEAM rank data (admin only)
  async createKEAMRankData(rankData: Omit<KEAMRankData, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('keam_rank_data')
      .insert([rankData])
      .select()
      .single()

    if (error) {
      console.error('Error creating KEAM rank data:', error)
      return { data: null, error }
    }

    return { data: data as KEAMRankData, error: null }
  },

  // Bulk insert KEAM rank data (admin only)
  async bulkInsertKEAMRankData(rankDataArray: Omit<KEAMRankData, 'id' | 'created_at'>[]) {
    const { data, error } = await supabase
      .from('keam_rank_data')
      .insert(rankDataArray)
      .select()

    if (error) {
      console.error('Error bulk inserting KEAM rank data:', error)
      return { data: [], error }
    }

    return { data: data as KEAMRankData[], error: null }
  },

  // Predict colleges based on KEAM rank
  async predictColleges(keamRank: number, category: string) {
    try {
      // Get historical data for the last 4 years
      const currentYear = new Date().getFullYear()
      const years = [currentYear - 3, currentYear - 2, currentYear - 1, currentYear]
      
      const { data: historicalData, error } = await this.getKEAMRankData({
        category: category
      })

      if (error || !historicalData) {
        throw new Error('Failed to fetch historical data')
      }

      // Filter data for the last 4 years
      const recentData = historicalData.filter(item => years.includes(item.year))

      // Calculate prediction based on historical trends
      const predictions = this.calculatePredictions(keamRank, category, recentData)

      // Save prediction to database
      const { error: saveError } = await supabase
        .from('keam_predictions')
        .insert([{
          keam_rank: keamRank,
          category: category,
          prediction_data: predictions
        }])

      if (saveError) {
        console.error('Error saving prediction:', saveError)
      }

      return { data: predictions, error: null }
    } catch (err) {
      console.error('Error predicting colleges:', err)
      return { data: null, error: err as Error }
    }
  },

  // Calculate predictions based on historical data
  calculatePredictions(keamRank: number, category: string, historicalData: KEAMRankData[]) {
    const highChance: Array<{college_name: string, course_name: string, category: string, confidence: number}> = []
    const mediumChance: Array<{college_name: string, course_name: string, category: string, confidence: number}> = []
    const lowChance: Array<{college_name: string, course_name: string, category: string, confidence: number}> = []

    // Group data by college and course
    const collegeCourseData = new Map<string, KEAMRankData[]>()
    
    historicalData.forEach(item => {
      const key = `${item.college_code}_${item.course_name}`
      if (!collegeCourseData.has(key)) {
        collegeCourseData.set(key, [])
      }
      collegeCourseData.get(key)!.push(item)
    })

    // Analyze each college-course combination
    collegeCourseData.forEach((data, key) => {
      if (data.length === 0) return

      // Calculate average cutoff and trend
      const sortedData = data.sort((a, b) => a.year - b.year)
      const avgCutoff = data.reduce((sum, item) => sum + item.rank_cutoff, 0) / data.length
      
      // Calculate trend (positive = increasing cutoff, negative = decreasing)
      let trend = 0
      if (sortedData.length > 1) {
        const firstCutoff = sortedData[0].rank_cutoff
        const lastCutoff = sortedData[sortedData.length - 1].rank_cutoff
        trend = lastCutoff - firstCutoff
      }

      // Predict next year's cutoff
      const predictedCutoff = avgCutoff + (trend * 0.5) // Conservative trend projection
      
      // Calculate confidence based on data consistency
      const variance = data.reduce((sum, item) => sum + Math.pow(item.rank_cutoff - avgCutoff, 2), 0) / data.length
      const confidence = Math.max(0, 100 - (variance / 100))

      const collegeName = data[0].college_name
      const courseName = data[0].course_name

      const prediction = {
        college_name: collegeName,
        course_name: courseName,
        category: category,
        confidence: Math.round(confidence)
      }

      // Categorize based on rank vs predicted cutoff
      if (keamRank <= predictedCutoff * 0.8) {
        highChance.push(prediction)
      } else if (keamRank <= predictedCutoff * 1.2) {
        mediumChance.push(prediction)
      } else {
        lowChance.push(prediction)
      }
    })

    // Sort by confidence
    highChance.sort((a, b) => b.confidence - a.confidence)
    mediumChance.sort((a, b) => b.confidence - a.confidence)
    lowChance.sort((a, b) => b.confidence - a.confidence)

    return {
      high_chance: highChance.slice(0, 10), // Top 10 high chance
      medium_chance: mediumChance.slice(0, 15), // Top 15 medium chance
      low_chance: lowChance.slice(0, 10) // Top 10 low chance
    }
  },

  // Get user's prediction history
  async getUserPredictions(userId: string) {
    const { data, error } = await supabase
      .from('keam_predictions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user predictions:', error)
      return { data: [], error }
    }

    return { data: data as KEAMPrediction[], error: null }
  }
}