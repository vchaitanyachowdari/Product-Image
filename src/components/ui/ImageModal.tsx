import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { UI_CONFIG } from '@/src/config';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <div
      className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
      aria-labelledby='image-modal-title'
    >
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in ${UI_CONFIG.modalAnimationDuration}ms ease-out;
        }
      `}</style>

      <div
        className='relative bg-white p-2 rounded-lg shadow-2xl'
        onClick={e => e.stopPropagation()}
      >
        <h2 id='image-modal-title' className='sr-only'>
          Enlarged Image View
        </h2>
        <button
          onClick={onClose}
          className='absolute top-[-0.75rem] right-[-0.75rem] bg-white rounded-full p-1 text-slate-600 hover:text-slate-900 transition-colors z-10 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          aria-label='Close image view'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
        <img
          src={imageUrl}
          alt='Generated product in-situ'
          className='object-contain block'
          style={{ maxHeight: '85vh', maxWidth: '90vw' }}
        />
      </div>
    </div>,
    document.body
  );
};