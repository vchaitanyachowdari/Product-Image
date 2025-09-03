
import { useState, useCallback } from 'react';

import { UI_CONFIG, ERROR_MESSAGES } from '@/src/config';
import { databaseService } from '@/src/services/appwrite/database';
import { generateInSituImage, fileToBase64 } from '@/src/services/gemini';
import type { GeneratedImage } from '@/types/database.types';

import { useAppwriteAuth } from './useAppwriteAuth';


export const useImageGeneration = () => {
  const { user } = useAppwriteAuth();
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

      if (!user) {
        setError('You must be logged in to generate images.');
        return;
      }

      setIsLoading(true);
      setError(null);
      setGeneratedImage(null);
      const randomIndex = Math.floor(Math.random() * UI_CONFIG.loadingMessages.length);
      const message = UI_CONFIG.loadingMessages[randomIndex] || 'Processing your request...';
      setLoadingMessage(message);

      try {
        const imagePayloads = await Promise.all(
          uploadedImages.map(file => fileToBase64(file))
        );

        const resultBase64 = await generateInSituImage(imagePayloads, prompt);

        if (resultBase64) {
          const imageUrl = `data:image/png;base64,${resultBase64}`;
          setGeneratedImage(imageUrl);

          // Save to database with enhanced metadata
          const imageData: Omit<GeneratedImage, '$id' | '$createdAt' | '$updatedAt'> = {
            userId: user.$id,
            title: `Generated Image - ${new Date().toLocaleDateString()}`,
            description: `Generated with prompt: ${prompt}`,
            prompt,
            imageUrl,
            thumbnailUrl: imageUrl, // In production, you'd generate a smaller thumbnail
            originalImageUrl: uploadedImages.length > 0 ? (uploadedImagePreviews[0] || '') : '',
            settings: {
              model: 'gemini-pro-vision',
              quality: 'standard',
              size: 'auto',
            },
            metadata: {
              fileSize: Math.round(resultBase64.length * 0.75), // Approximate base64 to bytes
              dimensions: {
                width: 1024, // Default dimensions - in production, extract from actual image
                height: 1024,
              },
              format: 'png',
            },
            isPublic: false,
            tags: extractTagsFromPrompt(prompt),
            favoriteCount: 0,
            shareCount: 0,
          };

          await databaseService.saveGeneratedImage(imageData);
        } else {
          setError(ERROR_MESSAGES.generation);
        }
      } catch (err) {
        if (import.meta.env.MODE === 'development') {
          // eslint-disable-next-line no-console
          console.error('Image generation error:', err);
        }
        setError(ERROR_MESSAGES.generation);
      } finally {
        setIsLoading(false);
      }
    },
    [uploadedImages, user]
  );

  // Helper function to extract tags from prompt
  const extractTagsFromPrompt = (prompt: string): string[] => {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = prompt.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word))
      .slice(0, 5); // Limit to 5 tags
    
    return [...new Set(words)]; // Remove duplicates
  };

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
