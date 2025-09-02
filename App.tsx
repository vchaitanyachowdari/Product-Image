import React, { useState, useCallback } from 'react';

import Header from './components/Header';
import ImageModal from './components/ImageModal';
import ImageUploader from './components/ImageUploader';
import LoginPage from './components/LoginPage';
import PromptControls from './components/PromptControls';
import RegisterPage from './components/RegisterPage';
import ResultDisplay from './components/ResultDisplay';
import { generateInSituImage, fileToBase64 } from './services/geminiService';

type Page = 'login' | 'register' | 'app';

const App: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedImagePreviews, setUploadedImagePreviews] = useState<string[]>(
    []
  );
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>('login');

  const loadingMessages = [
    'Placing your products in a new world...',
    'AI is getting creative with your items...',
    'Composing the perfect scene...',
    'Rendering pixels of perfection...',
    'Hold tight, magic is happening...',
  ];

  const handleImageUpload = useCallback(
    (files: File[]) => {
      const combinedFiles = [...uploadedImages, ...files];
      if (combinedFiles.length > 4) {
        setError('You can upload a maximum of 4 images.');
        // Optionally, only take the first 4
        // combinedFiles = combinedFiles.slice(0, 4);
        return;
      }

      setUploadedImages(combinedFiles);
      setGeneratedImage(null);
      setError(null);

      const newPreviews: string[] = [];
      combinedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          // This is a bit simplistic for multiple files, better to update all at once
          if (newPreviews.length === combinedFiles.length) {
            setUploadedImagePreviews(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      });
      setUploadedImagePreviews(combinedFiles.map(f => URL.createObjectURL(f)));
    },
    [uploadedImages]
  );

  const handleRemoveImage = useCallback((indexToRemove: number) => {
    setUploadedImages(prev =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setUploadedImagePreviews(prev =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  }, []);

  const handleGenerate = useCallback(
    async (prompt: string) => {
      if (uploadedImages.length === 0) {
        setError('Please upload at least one product image.');
        return;
      }

      setIsLoading(true);
      setError(null);
      setGeneratedImage(null);
      setLoadingMessage(
        loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
      );

      try {
        const imagePayloads = await Promise.all(
          uploadedImages.map(file => fileToBase64(file))
        );

        const resultBase64 = await generateInSituImage(imagePayloads, prompt);

        if (resultBase64) {
          setGeneratedImage(`data:image/png;base64,${resultBase64}`);
        } else {
          setError(
            'The AI could not generate an image. Please try a different prompt or image.'
          );
        }
      } catch (err) {
        console.error(err);
        setError(
          'An error occurred while generating the image. Please check the console for details.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [uploadedImages]
  );

  const handleImageClick = useCallback(() => {
    if (generatedImage) {
      setIsModalOpen(true);
    }
  }, [generatedImage]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // --- Auth Handlers ---
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('app');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

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
  );
};

export default App;
