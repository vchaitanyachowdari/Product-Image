import React from 'react';

import Loader from './Loader';

interface ResultDisplayProps {
  isLoading: boolean;
  generatedImageUrl: string | null;
  error: string | null;
  loadingMessage: string;
  onImageClick: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  isLoading,
  generatedImageUrl,
  error,
  loadingMessage,
  onImageClick,
}) => {
  const Placeholder = () => (
    <div className='text-center text-slate-500'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='mx-auto h-16 w-16 text-slate-300'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={1}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 01-6.23-.693L4.2 15.3m15.6 0c1.646 0 3.32-.25 4.942-1.077a4.482 4.482 0 00-9.884 0c1.622.827 3.296 1.077 4.942 1.077z'
        />
      </svg>
      <p className='mt-4 font-semibold'>
        Your generated image will appear here
      </p>
      <p className='text-sm'>
        Upload a product and choose an environment to start.
      </p>
    </div>
  );

  return (
    <div className='w-full aspect-square border-2 border-slate-200 bg-slate-100 rounded-lg flex items-center justify-center p-4'>
      {isLoading && <Loader message={loadingMessage} />}
      {!isLoading && error && (
        <div className='text-center text-red-600'>
          <p className='font-semibold'>Oh no! Something went wrong.</p>
          <p className='text-sm'>{error}</p>
        </div>
      )}
      {!isLoading && !error && generatedImageUrl && (
        <div className='w-full h-full flex flex-col items-center justify-center space-y-4'>
          <button
            onClick={onImageClick}
            className='w-full h-[85%] flex items-center justify-center cursor-pointer group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md'
            aria-label='View larger image'
          >
            <img
              src={generatedImageUrl}
              alt='Generated product'
              className='max-w-full max-h-full object-contain rounded-md shadow-lg group-hover:shadow-xl transition-shadow duration-300'
            />
          </button>
          <a
            href={generatedImageUrl}
            download='generated-product-image.png'
            className='inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4 mr-2'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
              />
            </svg>
            Download
          </a>
        </div>
      )}
      {!isLoading && !error && !generatedImageUrl && <Placeholder />}
    </div>
  );
};

export default ResultDisplay;
