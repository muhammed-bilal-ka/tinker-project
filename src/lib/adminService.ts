import { supabase } from './supabase';
import { fileProcessor, FileProcessingResult } from './fileProcessor';
import type { 
  AdminRole, 
  College, 
  Event, 
  KEAMRankData, 
  FileUpload, 
  FlaggedReview 
} from './supabase';

export interface AdminService {
  // Admin status and permissions
  checkAdminStatus(userId: string): Promise<{ data: AdminRole | null; error: Error | null }>;
  getAdminPermissions(userId: string): Promise<{ data: string[]; error: Error | null }>;
  
  // College management
  createCollege(collegeData: Partial<College>): Promise<{ data: College | null; error: Error | null }>;
  updateCollege(collegeId: string, collegeData: Partial<College>): Promise<{ data: College | null; error: Error | null }>;
  deleteCollege(collegeId: string): Promise<{ error: Error | null }>;
  
  // Event management
  createEvent(eventData: Partial<Event>): Promise<{ data: Event | null; error: Error | null }>;
  updateEvent(eventId: string, eventData: Partial<Event>): Promise<{ data: Event | null; error: Error | null }>;
  deleteEvent(eventId: string): Promise<{ error: Error | null }>;
  
  // KEAM data management
  createKEAMData(keamData: Partial<KEAMRankData>): Promise<{ data: KEAMRankData | null; error: Error | null }>;
  updateKEAMData(keamId: string, keamData: Partial<KEAMRankData>): Promise<{ data: KEAMRankData | null; error: Error | null }>;
  deleteKEAMData(keamId: string): Promise<{ error: Error | null }>;
  
  // File uploads and processing
  uploadFile(fileData: Partial<FileUpload>): Promise<{ data: FileUpload | null; error: Error | null }>;
  getFileUploads(adminId: string): Promise<{ data: FileUpload[]; error: Error | null }>;
  deleteFileUpload(fileId: string): Promise<{ error: Error | null }>;
  processCollegeFile(file: File, adminId: string): Promise<FileProcessingResult>;
  processKEAMFile(file: File, adminId: string): Promise<FileProcessingResult>;
  
  // Flagged reviews
  getFlaggedReviews(): Promise<{ data: FlaggedReview[]; error: Error | null }>;
  updateFlaggedReview(reviewId: string, updateData: Partial<FlaggedReview>): Promise<{ error: Error | null }>;
  deleteFlaggedReview(reviewId: string): Promise<{ error: Error | null }>;
  
  // User management
  getUsers(): Promise<{ data: any[]; error: Error | null }>;
  updateUserRole(userId: string, role: string): Promise<{ error: Error | null }>;
  deleteUser(userId: string): Promise<{ error: Error | null }>;
  
  // Analytics and stats
  getDashboardStats(): Promise<{ data: any; error: Error | null }>;
  exportData(dataType: string): Promise<{ data: any; error: Error | null }>;
  
  // KEAM Predictor
  predictColleges(keamRank: number, category: string): Promise<{ data: any; error: Error | null }>;
}

class AdminServiceImpl implements AdminService {
  // Admin status and permissions
  async checkAdminStatus(userId: string) {
    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      return { data: data as AdminRole | null, error: error as Error | null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  }

  async getAdminPermissions(userId: string) {
    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('permissions')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error) return { data: [], error: error as Error };
      return { data: data?.permissions || [], error: null };
    } catch (err) {
      return { data: [], error: err as Error };
    }
  }

  // College management
  async createCollege(collegeData: Partial<College>) {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .insert([collegeData])
        .select()
        .single();

      return { data: data as College | null, error: error as Error | null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  }

  async updateCollege(collegeId: string, collegeData: Partial<College>) {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .update(collegeData)
        .eq('id', collegeId)
        .select()
        .single();

      return { data: data as College | null, error: error as Error | null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  }

  async deleteCollege(collegeId: string) {
    try {
      const { error } = await supabase
        .from('colleges')
        .delete()
        .eq('id', collegeId);

      return { error: error as Error | null };
    } catch (err) {
      return { error: err as Error };
    }
  }

  // Event management
  async createEvent(eventData: Partial<Event>) {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();

      return { data: data as Event | null, error: error as Error | null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  }

  async updateEvent(eventId: string, eventData: Partial<Event>) {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', eventId)
        .select()
        .single();

      return { data: data as Event | null, error: error as Error | null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  }

  async deleteEvent(eventId: string) {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      return { error: error as Error | null };
    } catch (err) {
      return { error: err as Error };
    }
  }

  // KEAM data management
  async createKEAMData(keamData: Partial<KEAMRankData>) {
    try {
      const { data, error } = await supabase
        .from('keam_rank_data')
        .insert([keamData])
        .select()
        .single();

      return { data: data as KEAMRankData | null, error: error as Error | null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  }

  async updateKEAMData(keamId: string, keamData: Partial<KEAMRankData>) {
    try {
      const { data, error } = await supabase
        .from('keam_rank_data')
        .update(keamData)
        .eq('id', keamId)
        .select()
        .single();

      return { data: data as KEAMRankData | null, error: error as Error | null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  }

  async deleteKEAMData(keamId: string) {
    try {
      const { error } = await supabase
        .from('keam_rank_data')
        .delete()
        .eq('id', keamId);

      return { error: error as Error | null };
    } catch (err) {
      return { error: err as Error };
    }
  }

  // File uploads and processing
  async uploadFile(fileData: Partial<FileUpload>) {
    try {
      const { data, error } = await supabase
        .from('file_uploads')
        .insert([fileData])
        .select()
        .single();

      return { data: data as FileUpload | null, error: error as Error | null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  }

  async getFileUploads(adminId: string) {
    try {
      const { data, error } = await supabase
        .from('file_uploads')
        .select('*')
        .eq('admin_id', adminId)
        .order('created_at', { ascending: false });

      return { data: data as FileUpload[] || [], error: error as Error | null };
    } catch (err) {
      return { data: [], error: err as Error };
    }
  }

  async deleteFileUpload(fileId: string) {
    try {
      const { error } = await supabase
        .from('file_uploads')
        .delete()
        .eq('id', fileId);

      return { error: error as Error | null };
    } catch (err) {
      return { error: err as Error };
    }
  }

  async processCollegeFile(file: File, adminId: string): Promise<FileProcessingResult> {
    try {
      // First, create file upload record
      const fileData = {
        admin_id: adminId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: `https://example.com/uploads/${file.name}`,
        upload_type: 'college_data' as const,
        status: 'processing' as const,
        metadata: {
          originalName: file.name,
          size: file.size,
          type: file.type
        }
      };

      const { data: uploadRecord, error: uploadError } = await this.uploadFile(fileData);
      if (uploadError) {
        return {
          success: false,
          message: 'Failed to create upload record',
          errors: [uploadError.message]
        };
      }

      // Process the file
      const result = await fileProcessor.processCollegeFile(file);

      // Update upload record with processing result
      const updateData = {
        status: result.success ? 'processed' : 'failed',
        metadata: {
          ...fileData.metadata,
          processingResult: result,
          processedAt: new Date().toISOString()
        }
      };

      if (uploadRecord) {
        await supabase
          .from('file_uploads')
          .update(updateData)
          .eq('id', uploadRecord.id);
      }

      return result;
    } catch (err) {
      return {
        success: false,
        message: 'Error processing college file',
        errors: [(err as Error).message]
      };
    }
  }

  async processKEAMFile(file: File, adminId: string): Promise<FileProcessingResult> {
    try {
      // First, create file upload record
      const fileData = {
        admin_id: adminId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: `https://example.com/uploads/${file.name}`,
        upload_type: 'keam_data' as const,
        status: 'processing' as const,
        metadata: {
          originalName: file.name,
          size: file.size,
          type: file.type
        }
      };

      const { data: uploadRecord, error: uploadError } = await this.uploadFile(fileData);
      if (uploadError) {
        return {
          success: false,
          message: 'Failed to create upload record',
          errors: [uploadError.message]
        };
      }

      // Process the file
      const result = await fileProcessor.processKEAMFile(file);

      // Update upload record with processing result
      const updateData = {
        status: result.success ? 'processed' : 'failed',
        metadata: {
          ...fileData.metadata,
          processingResult: result,
          processedAt: new Date().toISOString()
        }
      };

      if (uploadRecord) {
        await supabase
          .from('file_uploads')
          .update(updateData)
          .eq('id', uploadRecord.id);
      }

      return result;
    } catch (err) {
      return {
        success: false,
        message: 'Error processing KEAM file',
        errors: [(err as Error).message]
      };
    }
  }

  // Flagged reviews
  async getFlaggedReviews() {
    try {
      const { data, error } = await supabase
        .from('flagged_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      return { data: data as FlaggedReview[] || [], error: error as Error | null };
    } catch (err) {
      return { data: [], error: err as Error };
    }
  }

  async updateFlaggedReview(reviewId: string, updateData: Partial<FlaggedReview>) {
    try {
      const { error } = await supabase
        .from('flagged_reviews')
        .update(updateData)
        .eq('id', reviewId);

      return { error: error as Error | null };
    } catch (err) {
      return { error: err as Error };
    }
  }

  async deleteFlaggedReview(reviewId: string) {
    try {
      const { error } = await supabase
        .from('flagged_reviews')
        .delete()
        .eq('id', reviewId);

      return { error: error as Error | null };
    } catch (err) {
      return { error: err as Error };
    }
  }

  // User management
  async getUsers() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      return { data: data || [], error: error as Error | null };
    } catch (err) {
      return { data: [], error: err as Error };
    }
  }

  async updateUserRole(userId: string, role: string) {
    try {
      const { error } = await supabase
        .from('admin_roles')
        .upsert({
          user_id: userId,
          role: role,
          is_active: true
        });

      return { error: error as Error | null };
    } catch (err) {
      return { error: err as Error };
    }
  }

  async deleteUser(userId: string) {
    try {
      // Delete from admin_roles first
      await supabase
        .from('admin_roles')
        .delete()
        .eq('user_id', userId);

      // Delete from user_profiles
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

      return { error: error as Error | null };
    } catch (err) {
      return { error: err as Error };
    }
  }

  // Analytics and stats
  async getDashboardStats() {
    try {
      // Get counts from different tables
      const [collegesCount, eventsCount, keamCount, reviewsCount] = await Promise.all([
        supabase.from('colleges').select('id', { count: 'exact' }),
        supabase.from('events').select('id', { count: 'exact' }),
        supabase.from('keam_rank_data').select('id', { count: 'exact' }),
        supabase.from('flagged_reviews').select('id', { count: 'exact' })
      ]);

      return {
        data: {
          colleges: collegesCount.count || 0,
          events: eventsCount.count || 0,
          keamData: keamCount.count || 0,
          flaggedReviews: reviewsCount.count || 0
        },
        error: null
      };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  }

  async exportData(dataType: string) {
    try {
      let query;
      switch (dataType) {
        case 'colleges':
          query = supabase.from('colleges').select('*');
          break;
        case 'events':
          query = supabase.from('events').select('*');
          break;
        case 'keam':
          query = supabase.from('keam_rank_data').select('*');
          break;
        default:
          throw new Error('Invalid data type');
      }

      const { data, error } = await query;
      if (error) throw error;

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  }

  // KEAM Predictor with AI-enhanced analysis
  async predictColleges(keamRank: number, category: string) {
    try {
      // Get historical KEAM data
      const { data: keamData, error } = await supabase
        .from('keam_rank_data')
        .select('*')
        .eq('category', category)
        .order('rank_cutoff', { ascending: false });

      if (error) throw error;

      if (!keamData || keamData.length === 0) {
        return {
          data: {
            high_chance: [],
            medium_chance: [],
            low_chance: [],
            analysis: 'No historical data available for this category'
          },
          error: null
        };
      }

      // AI-enhanced prediction algorithm
      const predictions = this.calculatePredictions(keamRank, category, keamData);

      return { data: predictions, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  }

  private calculatePredictions(keamRank: number, category: string, historicalData: KEAMRankData[]) {
    // Advanced prediction algorithm with multiple factors
    const predictions = {
      high_chance: [] as any[],
      medium_chance: [] as any[],
      low_chance: [] as any[],
      analysis: ''
    };

    // Group by college and course
    const collegeCourseMap = new Map<string, KEAMRankData[]>();
    historicalData.forEach(record => {
      const key = `${record.college_name}-${record.course_name}`;
      if (!collegeCourseMap.has(key)) {
        collegeCourseMap.set(key, []);
      }
      collegeCourseMap.get(key)!.push(record);
    });

    // Calculate predictions for each college-course combination
    collegeCourseMap.forEach((records, key) => {
      const [collegeName, courseName] = key.split('-');
      
      // Calculate average cutoff rank
      const avgCutoff = records.reduce((sum, record) => sum + record.rank_cutoff, 0) / records.length;
      
      // Calculate trend (recent years vs older years)
      const recentRecords = records.filter(r => r.year >= new Date().getFullYear() - 2);
      const olderRecords = records.filter(r => r.year < new Date().getFullYear() - 2);
      
      let trendFactor = 0;
      if (recentRecords.length > 0 && olderRecords.length > 0) {
        const recentAvg = recentRecords.reduce((sum, r) => sum + r.rank_cutoff, 0) / recentRecords.length;
        const olderAvg = olderRecords.reduce((sum, r) => sum + r.rank_cutoff, 0) / olderRecords.length;
        trendFactor = (recentAvg - olderAvg) / olderAvg; // Positive means increasing cutoff
      }

      // Calculate confidence score
      const rankDifference = avgCutoff - keamRank;
      const confidence = Math.max(0, Math.min(100, 
        (rankDifference / avgCutoff) * 100 + (trendFactor * 20)
      ));

      const prediction = {
        college_name: collegeName,
        course_name: courseName,
        category: category,
        confidence: Math.round(confidence),
        avg_cutoff: Math.round(avgCutoff),
        trend: trendFactor > 0.1 ? 'increasing' : trendFactor < -0.1 ? 'decreasing' : 'stable'
      };

      // Categorize based on confidence
      if (confidence >= 70) {
        predictions.high_chance.push(prediction);
      } else if (confidence >= 40) {
        predictions.medium_chance.push(prediction);
      } else {
        predictions.low_chance.push(prediction);
      }
    });

    // Sort by confidence
    predictions.high_chance.sort((a, b) => b.confidence - a.confidence);
    predictions.medium_chance.sort((a, b) => b.confidence - a.confidence);
    predictions.low_chance.sort((a, b) => b.confidence - a.confidence);

    // Generate analysis
    predictions.analysis = this.generateAnalysis(predictions, keamRank, category);

    return predictions;
  }

  private generateAnalysis(predictions: any, keamRank: number, category: string) {
    const totalOptions = predictions.high_chance.length + predictions.medium_chance.length + predictions.low_chance.length;
    
    let analysis = `Based on your KEAM rank of ${keamRank} in the ${category} category, `;
    
    if (predictions.high_chance.length > 0) {
      analysis += `you have ${predictions.high_chance.length} high-probability options. `;
    }
    
    if (predictions.medium_chance.length > 0) {
      analysis += `There are ${predictions.medium_chance.length} medium-probability choices. `;
    }
    
    if (totalOptions === 0) {
      analysis += "No historical data available for this rank and category combination.";
    } else {
      analysis += `Consider applying to ${Math.min(5, totalOptions)} colleges for the best chances.`;
    }
    
    return analysis;
  }
}

export const adminService = new AdminServiceImpl(); 