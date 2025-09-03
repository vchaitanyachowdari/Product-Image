/**
 * User Dashboard Component
 */

import React, { useState, useEffect } from 'react';

import { ImageGallery } from '@/src/components/gallery/ImageGallery';
import { QuickStartGuide } from '@/src/components/help';
import { UserProfile } from '@/src/components/profile/UserProfile';
import { useAppwriteAuth } from '@/src/hooks/useAppwriteAuth';
import { databaseService } from '@/src/services/appwrite/database';
import type { UserProfile as UserProfileType, GeneratedImage } from '@/types/database.types';

type TabType = 'overview' | 'gallery' | 'favorites' | 'profile';

export const UserDashboard: React.FC = () => {
  const { user } = useAppwriteAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [recentImages, setRecentImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuickStart, setShowQuickStart] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load or create user profile
      let userProfile = await databaseService.getUserProfile(user.$id);
      if (!userProfile) {
        userProfile = await databaseService.createUserProfile(
          user.$id,
          user.email,
          user.name
        );
      }
      setProfile(userProfile);

      // Load recent images
      const images = await databaseService.getUserImages(user.$id, 6);
      setRecentImages(images);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile: UserProfileType) => {
    setProfile(updatedProfile);
  };

  if (!user || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load user profile</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'gallery', label: 'My Images', icon: '🖼️' },
    { id: 'favorites', label: 'Favorites', icon: '❤️' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {profile.name}!</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Images Generated</p>
                    <p className="text-2xl font-bold text-gray-900">{profile.stats.imagesGenerated}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-full">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Favorites</p>
                    <p className="text-2xl font-bold text-gray-900">{profile.stats.favoriteCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Shares</p>
                    <p className="text-2xl font-bold text-gray-900">{profile.stats.shareCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Images */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Images</h2>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All →
                </button>
              </div>
              
              {recentImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {recentImages.map((image) => (
                    <div key={image.$id} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={image.thumbnailUrl || image.imageUrl}
                        alt={image.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
                  <p className="text-gray-500">Start generating some amazing images!</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center">
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="font-medium text-gray-900">Generate Image</div>
                  <div className="text-sm text-gray-500">Create new AI art</div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('favorites')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors text-center"
                >
                  <div className="text-2xl mb-2">❤️</div>
                  <div className="font-medium text-gray-900">View Favorites</div>
                  <div className="text-sm text-gray-500">See liked images</div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
                >
                  <div className="text-2xl mb-2">⚙️</div>
                  <div className="font-medium text-gray-900">Settings</div>
                  <div className="text-sm text-gray-500">Update profile</div>
                </button>
                
                <button 
                  onClick={() => setShowQuickStart(true)}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
                >
                  <div className="text-2xl mb-2">📚</div>
                  <div className="font-medium text-gray-900">Quick Guide</div>
                  <div className="text-sm text-gray-500">Learn the basics</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Images</h2>
              <div className="text-sm text-gray-500">
                {profile.stats.imagesGenerated} total images
              </div>
            </div>
            <ImageGallery userId={user.$id} />
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Favorite Images</h2>
              <div className="text-sm text-gray-500">
                {profile.stats.favoriteCount} favorites
              </div>
            </div>
            <ImageGallery showFavoritesOnly={true} />
          </div>
        )}

        {activeTab === 'profile' && (
          <UserProfile profile={profile} onProfileUpdate={handleProfileUpdate} />
        )}
      </div>

      {/* Quick Start Guide Modal */}
      {showQuickStart && (
        <QuickStartGuide onClose={() => setShowQuickStart(false)} />
      )}
    </div>
  );
};