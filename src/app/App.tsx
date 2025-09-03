import React, { useState, useCallback } from 'react';

import { AdminDashboard } from '@/src/components/admin/AdminDashboard';
import { LoginPage, RegisterPage, OAuthCallback } from '@/src/components/auth';
import { ErrorBoundary } from '@/src/components/common';
import { UserDashboard } from '@/src/components/dashboard/UserDashboard';
import { 
  ImageUploader, 
  PromptControls, 
  ResultDisplay 
} from '@/src/components/features';
import { LandingPage } from '@/src/components/landing';
import { Header } from '@/src/components/layout';
import { Router, Link } from '@/src/components/routing/Router';
import { SearchPage } from '@/src/components/search/SearchPage';
import { ImageModal } from '@/src/components/ui';
import { useImageGeneration } from '@/src/hooks';
import { useAppwriteAuth } from '@/src/hooks/useAppwriteAuth';

// Main Image Generation Page Component
const ImageGenerationPage: React.FC = () => {
  const {
    uploadedImages,
    uploadedImagePreviews,
    generatedImage,
    isLoading,
    error,
    loadingMessage,
    handleImageUpload,
    handleRemoveImage,
    handleGenerate,
  } = useImageGeneration();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleImageClick = useCallback(() => {
    if (generatedImage) {
      setIsModalOpen(true);
    }
  }, [generatedImage]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <main className='container mx-auto p-4 md:p-8'>
        <div className='max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='flex flex-col space-y-6'>
              <h2 className='text-xl font-bold text-slate-700'>
                1. Upload Your Product(s)
              </h2>
              <ImageUploader
                onImageUpload={handleImageUpload}
                onRemoveImage={handleRemoveImage}
                imagePreviewUrls={uploadedImagePreviews}
                maxFiles={4}
              />

              <h2 className='text-xl font-bold text-slate-700 mt-4'>
                2. Choose Environment
              </h2>
              <PromptControls
                onGenerate={handleGenerate}
                isGenerating={isLoading}
                isImageUploaded={uploadedImages.length > 0}
              />
            </div>

            <div className='flex flex-col'>
              <h2 className='text-xl font-bold text-slate-700 mb-6'>
                3. View Result
              </h2>
              <ResultDisplay
                isLoading={isLoading}
                generatedImageUrl={generatedImage}
                error={error}
                loadingMessage={loadingMessage}
                onImageClick={handleImageClick}
              />
            </div>
          </div>
        </div>
        <footer className='text-center text-slate-500 mt-8 text-sm'>
          <p>Powered by React, Tailwind CSS, and Google Gemini</p>
        </footer>
      </main>
      {isModalOpen && generatedImage && (
        <ImageModal imageUrl={generatedImage} onClose={handleCloseModal} />
      )}
    </>
  );
};

// 404 Page Component
const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
        Go Home
      </Link>
    </div>
  </div>
);

// Simple Login Component for Router
const SimpleLoginPage: React.FC = () => {
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <LoginPage 
      onLoginSuccess={() => navigate('/dashboard')} 
      onNavigateToRegister={() => navigate('/register')} 
    />
  );
};

// Simple Register Component for Router
const SimpleRegisterPage: React.FC = () => {
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <RegisterPage 
      onRegisterSuccess={() => navigate('/dashboard')} 
      onNavigateToLogin={() => navigate('/login')} 
    />
  );
};

const App: React.FC = () => {
  const { user, isAuthenticated, logout } = useAppwriteAuth();

  // Check if user is admin (you'd implement this based on your user roles)
  const isAdmin = user?.labels?.includes('admin') || false;

  // Define application routes
  const routes = [
    { path: '/', component: isAuthenticated ? UserDashboard : LandingPage },
    { path: '/generate', component: ImageGenerationPage, requiresAuth: true },
    { path: '/dashboard', component: UserDashboard, requiresAuth: true },
    { path: '/search', component: SearchPage },
    { path: '/admin', component: AdminDashboard, requiresAuth: true, adminOnly: true },
    { path: '/login', component: SimpleLoginPage },
    { path: '/register', component: SimpleRegisterPage },
    { path: '/oauth/callback', component: OAuthCallback },
  ];

  return (
    <ErrorBoundary>
      <div className='min-h-screen bg-gray-100 font-sans'>
        <Router
          routes={routes}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          fallbackComponent={NotFoundPage}
          loginComponent={SimpleLoginPage}
        >
          <Header
            isLoggedIn={isAuthenticated}
            user={user}
            onLogout={logout}
          />
        </Router>
      </div>
    </ErrorBoundary>
  );
};

export default App;