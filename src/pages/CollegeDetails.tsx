import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Globe, Phone, Mail, Users, Calendar, Award, BookOpen, Edit, User } from 'lucide-react';
import { collegeService, reviewService, type College, type Review } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const CollegeDetails = () => {
  const { id } = useParams();
  const { isLoggedIn, user } = useAuth();
  const [college, setCollege] = useState<College | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    reviewText: ''
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  
  // Fetch college details
  useEffect(() => {
    const fetchCollege = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      const { data, error } = await collegeService.getCollegeById(id);
      
      if (error) {
        setError('Failed to fetch college details. Please try again.');
        console.error('Error fetching college:', error);
      } else {
        setCollege(data);
      }
      
      setLoading(false);
    };

    fetchCollege();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      
      setReviewsLoading(true);
      const { data } = await reviewService.getReviews(id);
      setReviews(data);
      setReviewsLoading(false);
    };

    fetchReviews();
  }, [id]);

  // Check if user has already reviewed
  useEffect(() => {
    const checkUserReview = async () => {
      if (!id || !user) return;
      
      const { data } = await reviewService.getUserReview(id, user.id);
      setUserReview(data);
    };

    checkUserReview();
  }, [id, user]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    setReviewSubmitting(true);

    try {
      const { error } = await reviewService.createReview({
        college_id: id,
        user_id: user.id,
        rating: reviewFormData.rating,
        review_text: reviewFormData.reviewText
      });

      if (error) {
        console.error('Error submitting review:', error);
      } else {
        // Refresh reviews
        const { data } = await reviewService.getReviews(id);
        setReviews(data);
        
        // Check user review again
        const { data: userReviewData } = await reviewService.getUserReview(id, user.id);
        setUserReview(userReviewData);
        
        setShowReviewForm(false);
        setReviewFormData({ rating: 5, reviewText: '' });
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleWriteReview = () => {
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    setShowReviewForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
              <div className="w-full h-80 bg-gray-200"></div>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/colleges"
            className="inline-flex items-center text-[#2563EB] hover:text-[#1d4ed8] mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Colleges
          </Link>
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {error || 'College not found'}
              </h3>
              <p className="text-gray-600 mb-4">
                The college you're looking for doesn't exist or couldn't be loaded.
              </p>
              <Link
                to="/colleges"
                className="bg-[#2563EB] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200"
              >
                Browse All Colleges
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/colleges"
          className="inline-flex items-center text-[#2563EB] hover:text-[#1d4ed8] mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Colleges
        </Link>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="relative">
            <img
              src={college.image_url || 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800'}
              alt={college.name}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{college.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{college.location || 'Kerala'}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-1 text-yellow-400" />
                  <span>{college.rating}</span>
                </div>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {college.type}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{college.description}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Courses Offered</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {college.courses_offered.map((course, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <h3 className="font-semibold text-gray-900 mb-2">{course}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Fees: {college.fees_range || 'Contact college for details'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Facilities</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {college.facilities.map((facility, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#2563EB] rounded-full"></div>
                    <span className="text-gray-700">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Reviews</h2>
                {!userReview && (
                  <button
                    onClick={handleWriteReview}
                    className="bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Write a Review</span>
                  </button>
                )}
              </div>

              {showReviewForm && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Write Your Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewFormData(prev => ({ ...prev, rating: star }))}
                            className={`w-8 h-8 ${
                              star <= reviewFormData.rating ? 'text-yellow-400' : 'text-gray-300'
                            } hover:text-yellow-400 transition-colors duration-200`}
                          >
                            <Star className="w-full h-full fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                      <textarea
                        value={reviewFormData.reviewText}
                        onChange={(e) => setReviewFormData(prev => ({ ...prev, reviewText: e.target.value }))}
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                        placeholder="Share your experience with this college..."
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={reviewSubmitting}
                        className="bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {reviewsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        {review.user_profiles?.avatar_url ? (
                          <img
                            src={review.user_profiles.avatar_url}
                            alt={review.user_profiles.full_name || 'User'}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {review.user_profiles?.full_name || 'Anonymous'}
                            </span>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 mt-1">{review.review_text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(review.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review this college!</p>
              )}
            </div>

            {college.affiliation && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Affiliation</h2>
                <p className="text-gray-700">{college.affiliation}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Established</p>
                    <p className="font-medium">{college.established_year || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Total Seats</p>
                    <p className="font-medium">{college.total_seats}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium">{college.type}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-3">
                {college.website && (
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:text-[#1d4ed8] transition-colors duration-200">
                      Visit Website
                    </a>
                  </div>
                )}
                {college.contact_phone && (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{college.contact_phone}</span>
                  </div>
                )}
                {college.contact_email && (
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{college.contact_email}</span>
                  </div>
                )}
                {college.address && (
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <span className="text-gray-700">{college.address}</span>
                  </div>
                )}
              </div>
            </div>

            {college.placement_percentage > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Placements</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#2563EB]">{college.placement_percentage}%</p>
                    <p className="text-sm text-gray-600">Placement Rate</p>
                  </div>
                  {college.fees_range && (
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">{college.fees_range}</p>
                      <p className="text-sm text-gray-600">Annual Fees</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">College Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">College Code</p>
                  <p className="font-medium text-gray-900">{college.college_code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="font-medium text-gray-900">{college.rating}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetails;