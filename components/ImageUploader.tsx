import React, { useRef, useCallback } from 'react';

interface ImageUploaderProps {
  onImageUpload: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  imagePreviewUrls: string[];
  maxFiles: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  onRemoveImage,
  imagePreviewUrls,
  maxFiles,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      onImageUpload(Array.from(files));
      // Clear the input value to allow re-uploading the same file
      event.target.value = '';
    }
  };

  const handleClick = useCallback(() => {
    if (imagePreviewUrls.length < maxFiles) {
      inputRef.current?.click();
    }
  }, [imagePreviewUrls.length, maxFiles]);

  const canUpload = imagePreviewUrls.length < maxFiles;

  return (
    <div className='w-full'>
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
        {imagePreviewUrls.map((url, index) => (
          <div key={index} className='relative aspect-square group'>
            <img
              src={url}
              alt={`Product preview ${index + 1}`}
              className='w-full h-full object-contain rounded-lg border border-slate-200 bg-white'
            />
            <button
              onClick={() => onRemoveImage(index)}
              className='absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white'
              aria-label={`Remove image ${index + 1}`}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4'
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
          </div>
        ))}

        {canUpload && (
          <div
            className='col-span-1 aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer p-4'
            onClick={handleClick}
            role='button'
            aria-label='Upload images'
          >
            <input
              type='file'
              ref={inputRef}
              onChange={handleFileChange}
              className='hidden'
              accept='image/png, image/jpeg, image/webp'
              multiple
            />
            <div className='text-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='mx-auto h-10 w-10'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={1}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 4v16m8-8H4'
                />
              </svg>
              <p className='mt-2 text-sm font-semibold'>Add Image</p>
              <p className='text-xs'>
                ({maxFiles - imagePreviewUrls.length} left)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
