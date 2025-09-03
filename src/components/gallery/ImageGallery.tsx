/**
 * Image Gallery Component for displaying user's generated images
 */

import React, { useState, useEffect } from 'react';

import { useAppwriteAuth } from '@/src/hooks/useAppwriteAuth';
import { databaseService } from '@/src/services/appwrite/database';
import type { GeneratedImage } from '@/types/database.types';

interface ImageGalleryProps {
  userId?: string;
  showPublicOnly?: boolean;
  showFavoritesOnly?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  userId, 
  showPublicOnly = false,
  showFavoritesOnly = false 
}) => {
  const { user } = useAppwriteAuth();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadImages();
    if (user) {
      loadUserFavorites();
    }
  }, [userId, showPublicOnly, showFavoritesOnly, user]);

  const loadImages = async () => {
    try {
      setLoading(true);
      let loadedImages: GeneratedImage[];

      if (showFavoritesOnly && user) {
        loadedImages = await databaseService.getUserFavorites(user.$id);
      } else if (showPublicOnly) {
        loadedImages = await databaseService.getPublicImages();
      } else if (userId) {
        loadedImages = await databaseService.getUserImages(userId);
      } else if (user) {
        loadedImages = await databaseService.getUserImages(user.$id);
      } else {
        loadedImages = [];
      }

      setImages(loadedImages);
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserFavorites = async () => {
    if (!user) return;
    
    try {
      const userFavorites = await databaseService.getUserFavorites(user.$id, 1000);
      const favoriteIds = new Set(userFavorites.map(img => img.$id));
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const handleFavoriteToggle = async (imageId: string) => {
    if (!user) return;

    try {
      const isFavorited = favorites.has(imageId);
      
      if (isFavorited) {
        await databaseService.removeFromFavorites(user.$id, imageId);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(imageId);
          return newSet;
        });
      } else {
        await databaseService.addToFavorites(user.$id, imageId);
        setFavorites(prev => new Set(prev).add(imageId));
      }

      // Refresh images to update favorite counts
      loadImages();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleShare = async (image: GeneratedImage) => {
    if (!user) return;

    try {
      const share = await databaseService.createShare(user.$id, image.$id);
      
      if (navigator.share) {
        await navigator.share({
          title: image.title,
          text: image.description || 'Check out this AI-generated image!',
          url: share.shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(share.shareUrl);
        alert('Share link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share image:', error);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!user || !confirm('Are you sure you want to delete this image?')) return;

    try {
      await databaseService.deleteImage(imageId, user.$id);
      setImages(prev => prev.filter(img => img.$id !== imageId));
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
        <p className="text-gray-500">
          {showFavoritesOnly 
            ? "You haven't favorited any images yet." 
            : "Start generating some amazing images!"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div key={image.$id} className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image */}
            <div className="aspect-square relative overflow-hidden">
              <img
                src={image.thumbnailUrl || image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                onClick={() => setSelectedImage(image)}
              />
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  {user && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteToggle(image.$id);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        favorites.has(image.$id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-red-50'
                      }`}
                      aria-label={favorites.has(image.$id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(image);
                    }}
                    className="p-2 bg-white text-gray-700 rounded-full hover:bg-blue-50 transition-colors"
                    aria-label="Share image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>

                  {user && image.userId === user.$id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image.$id);
                      }}
                      className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors"
                      aria-label="Delete image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Image Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 truncate">{image.title}</h3>
              {image.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{image.description}</p>
              )}
              
              <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {image.favoriteCount}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    {image.shareCount}
                  </span>
                </div>
                <span>{new Date(image.$createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">{selectedImage.title}</h2>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full h-auto max-h-96 object-contain mx-auto"
              />
              
              <div className="mt-4">
                {selectedImage.description && (
                  <p className="text-gray-700 mb-3">{selectedImage.description}</p>
                )}
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Prompt:</strong> {selectedImage.prompt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};