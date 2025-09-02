import { useState, useCallback } from 'react';
import { generateInSituImage, fileToBase64 } from '@/src/services/gemini';
import { UI_CONFIG, ERROR_MESSAGES } from '@/src/config';

export const useImageGeneration = () => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedImagePreviews, setUploadedImagePreviews] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleImageUpload = useCallback(
    (files: File[]) => {
      const combinedFiles = [...uploadedImages, ...files];
      if (combinedFiles.length > 4) {
        setError(ERROR_MESSAGES.maxFiles);
        return;
      }

      setUploadedImages(combinedFiles);
      setGeneratedImage(null);
      setError(null);

      // Create preview URLs
      const previewUrls = combinedFiles.map(file => URL.createObjectURL(file));
      setUploadedImagePreviews(previewUrls);
    },
    [uploadedImages]
  );

  const handleRemoveImage = useCallback((indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setUploadedImagePreviews(prev => {
      // Clean up object URLs to prevent memory leaks
      const urlToRevoke = prev[indexToRemove];
      if (urlToRevoke) {
        URL.revokeObjectURL(urlToRevoke);
      }
      return prev.filter((_, index) => index !== indexToRemove);
    });
  }, []);

  const handleGenerate = useCallback(
    async (prompt: string) => {
      if (uploadedImages.length === 0) {
        setError(ERROR_MESSAGES.noImages);
        return;
      }

      setIsLoading(true);
      setError(null);
      setGeneratedImage(null);
      setLoadingMessage(
        UI_CONFIG.loadingMessages[Math.floor(Math.random() * UI_CONFIG.loadingMessages.length)]!
      );

      try {
        const imagePayloads = await Promise.all(
          uploadedImages.map(file => fileToBase64(file))
        );

        const resultBase64 = await generateInSituImage(imagePayloads, prompt);

        if (resultBase64) {
          setGeneratedImage(`data:image/png;base64,${resultBase64}`);
        } else {
          setError(ERROR_MESSAGES.generation);
        }
      } catch (err) {
        console.error('Image generation error:', err);
        setError(ERROR_MESSAGES.generation);
      } finally {
        setIsLoading(false);
      }
    },
    [uploadedImages]
  );

  return {
    uploadedImages,
    uploadedImagePreviews,
    generatedImage,
    isLoading,
    error,
    loadingMessage,
    handleImageUpload,
    handleRemoveImage,
    handleGenerate,
  };
};