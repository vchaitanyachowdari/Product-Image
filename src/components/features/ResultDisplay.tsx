import React from 'react';

import { Loader } from './Loader';

interface ResultDisplayProps {
  isLoading: boolean;
  generatedImageUrl: string | null;
  error: string | null;
  loadingMessage: string;
  onImageClick: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
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
          d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
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

  const ErrorDisplay = () => (
    <div className='text-center text-red-600'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='mx-auto h-12 w-12 mb-3'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
        />
      </svg>
      <p className='font-semibold'>Generation Failed</p>
      <p className='text-sm mt-1'>{error}</p>
      <p className='text-xs text-slate-500 mt-2'>
        Try adjusting your prompt or using different images
      </p>
    </div>
  );

  return (
    <div className='w-full aspect-square border-2 border-slate-200 bg-slate-50 rounded-lg flex items-center justify-center p-4'>
      {isLoading && <Loader message={loadingMessage} />}
      
      {!isLoading && error && <ErrorDisplay />}
      
      {!isLoading && !error && generatedImageUrl && (
        <div className='w-full h-full flex flex-col items-center justify-center space-y-4'>
          <button
            onClick={onImageClick}
            className='w-full h-[85%] flex items-center justify-center cursor-pointer group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md'
            aria-label='View larger image'
          >
            <img
              src={generatedImageUrl}
              alt='Generated product placement'
              className='max-w-full max-h-full object-contain rounded-md shadow-lg group-hover:shadow-xl transition-shadow duration-300'
            />
          </button>
          
          <div className='flex space-x-2'>
            <a
              href={generatedImageUrl}
              download={`product-placement-${Date.now()}.png`}
              className='inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
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
            
            <button
              onClick={() => navigator.share?.({ 
                title: 'Generated Product Placement',
                url: generatedImageUrl 
              })}
              className='inline-flex items-center px-3 py-2 bg-slate-600 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2'
              style={{ display: typeof navigator !== 'undefined' && 'share' in navigator ? 'inline-flex' : 'none' }}
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
                  d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z'
                />
              </svg>
              Share
            </button>
          </div>
        </div>
      )}
      
      {!isLoading && !error && !generatedImageUrl && <Placeholder />}
    </div>
  );
};