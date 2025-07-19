import React, { useState } from 'react';
import { Building2, Image as ImageIcon } from 'lucide-react';

interface CollegeImageProps {
  imageUrl?: string;
  collegeName: string;
  collegeType?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const CollegeImage: React.FC<CollegeImageProps> = ({
  imageUrl,
  collegeName,
  collegeType = 'College',
  className = '',
  size = 'md'
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Generate fallback image based on college type
  const getFallbackImage = () => {
    const type = collegeType.toLowerCase();
    if (type.includes('government')) {
      return 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&crop=center&auto=format&q=80';
    } else if (type.includes('private')) {
      return 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80';
    } else {
      return 'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80';
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const displayImage = imageError ? getFallbackImage() : imageUrl || getFallbackImage();

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      
      <img
        src={displayImage}
        alt={`${collegeName} campus`}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      
      {imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Building2 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-xs text-blue-600 font-medium">{collegeName}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeImage; 