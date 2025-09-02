import React, { useState, useCallback } from 'react';

import { LoginPage, RegisterPage } from '@/src/components/auth';
import { ErrorBoundary } from '@/src/components/common';
import { 
  ImageUploader, 
  PromptControls, 
  ResultDisplay 
} from '@/src/components/features';
import { Header } from '@/src/components/layout';
import { ImageModal } from '@/src/components/ui';
import { useAuth, useImageGeneration } from '@/src/hooks';

const App: React.FC = () => {
  const { isLoggedIn, currentPage, handleLoginSuccess, handleLogout, navigateTo } = useAuth();
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

  const renderPage = () => {
    if (!isLoggedIn) {
      switch (currentPage) {
        case 'login':
          return (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={() => navigateTo('register')}
            />
          );
        case 'register':
          return (
            <RegisterPage
              onRegisterSuccess={handleLoginSuccess}
              onNavigateToLogin={() => navigateTo('login')}
            />
          );
        default:
          return (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={() => navigateTo('register')}
            />
          );
      }
    }

    return (
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
    );
  };

  return (
    <ErrorBoundary>
      <div className='min-h-screen bg-gray-100 font-sans'>
        <Header
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onNavigate={navigateTo}
        />
        {renderPage()}
        {isModalOpen && generatedImage && (
          <ImageModal imageUrl={generatedImage} onClose={handleCloseModal} />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;