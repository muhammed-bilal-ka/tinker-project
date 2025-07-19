import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface College {
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
    avatar_url?: string
    username?: string
  } | null // user_profiles can be null if the join doesn't find a match
}
/*
// This is how we get reviews from the database
export const reviewService = {
  async getReviews(collegeId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('college_reviews')
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
  async getReviews(collegeId: string) {
    const { data, error } = await supabase
      .from('college_reviews')
      .select(`
        *,
        user_profiles(full_name, avatar_url, username)
      `)
      .eq('college_id', collegeId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
      return { data: [], error }
    }

    return { data: data as Review[], error: null }
  },

  async createReview(reviewData: Omit<Review, 'id' | 'created_at' | 'user_profile'>) {
    const { data, error } = await supabase
      .from('college_reviews')
      .insert([reviewData])
      .select()
      .single()

    if (error) {
      console.error('Error creating review:', error)
      return { data: null, error }
    }

    return { data: data as Review, error: null }
  },

  async getUserReview(collegeId: string, userId: string) {
    const { data, error } = await supabase
      .from('college_reviews')
      .select('*')
      .eq('college_id', collegeId)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user review:', error)
      return { data: null, error }
    }

    return { data: data as Review | null, error: null }
  }
}