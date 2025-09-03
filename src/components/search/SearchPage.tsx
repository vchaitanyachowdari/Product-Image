/**
 * Search Page Component for discovering images
 */

import React, { useState, useEffect, useCallback } from 'react';

import { databaseService } from '@/src/services/appwrite/database';
// import { ImageGallery } from '@/src/components/gallery/ImageGallery';
import type { GeneratedImage } from '@/types/database.types';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    
    try {
      const searchResults = await databaseService.searchImages(searchQuery.trim());
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  // Load popular/recent images on initial load
  useEffect(() => {
    const loadInitialImages = async () => {
      try {
        const publicImages = await databaseService.getPublicImages(20);
        setResults(publicImages);
      } catch (error) {
        console.error('Failed to load initial images:', error);
      }
    };

    if (!hasSearched) {
      loadInitialImages();
    }
  }, [hasSearched]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing AI Art</h1>
        <p className="text-xl text-gray-600 mb-8">
          Search through thousands of AI-generated images created by our community
        </p>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for images, styles, or themes..."
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </div>
        </form>

        {/* Popular Search Terms */}
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['landscape', 'portrait', 'abstract', 'nature', 'architecture', 'fantasy', 'minimalist', 'colorful'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setQuery(term);
                  handleSearch(term);
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        {hasSearched && (
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {query ? `Search Results for "${query}"` : 'Popular Images'}
            </h2>
            <div className="text-sm text-gray-500">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for amazing images...</p>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {!loading && (
        <>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((image) => (
                <SearchResultCard key={image.$id} image={image} />
              ))}
            </div>
          ) : hasSearched ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500 mb-4">
                Try different keywords or browse popular images below
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  setHasSearched(false);
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Browse Popular Images
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

interface SearchResultCardProps {
  image: GeneratedImage;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ image }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="aspect-square relative overflow-hidden">
        <img
          src={image.thumbnailUrl || image.imageUrl}
          alt={image.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        
        {/* Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <button className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              View Details
            </button>
          </div>
        )}
      </div>

      {/* Image Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{image.title}</h3>
        {image.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{image.description}</p>
        )}
        
        {/* Tags */}
        {image.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {image.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {image.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{image.tags.length - 3}
              </span>
            )}
          </div>
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
  );
};