import React, { useState, useEffect } from 'react';

import SparklesIcon from './icons/SparklesIcon';

interface PromptControlsProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  isImageUploaded: boolean;
}

interface Preset {
  name: string;
  prompt: string;
}

const presets: Preset[] = [
  {
    name: 'Modern Home',
    prompt: 'Place the product(s) in a bright, modern home interior setting.',
  },
  {
    name: 'On a Desk',
    prompt:
      'Place the product(s) on a clean, wooden office desk next to a laptop.',
  },
  {
    name: 'Outdoors',
    prompt:
      'Place the product(s) in a natural outdoor setting with soft lighting.',
  },
  {
    name: 'Studio Shot',
    prompt:
      'Place the product(s) on a solid color background, as if in a professional photo studio.',
  },
  {
    name: 'Café Scene',
    prompt:
      'Place the product(s) on a small table in a cozy, well-lit café with a latte art coffee nearby.',
  },
  {
    name: 'Beach Setting',
    prompt:
      'Place the product(s) on the clean sand of a beautiful beach with the calm ocean in the background during sunset.',
  },
  {
    name: 'Minimalist Loft',
    prompt:
      'Situate the product(s) in a minimalist industrial loft apartment with concrete floors and large windows.',
  },
  {
    name: 'Forest Floor',
    prompt:
      'Place the product(s) on a mossy forest floor, surrounded by ferns and dappled sunlight.',
  },
];

const intelligentPlacementPrompt =
  'Based on the product image(s), place it in a suitable, aesthetically pleasing, and realistic environment that highlights its features.';

const PromptControls: React.FC<PromptControlsProps> = ({
  onGenerate,
  isGenerating,
  isImageUploaded,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim() && isImageUploaded) {
      onGenerate(customPrompt.trim());
    }
  };

  // Clear prompt if images are removed
  useEffect(() => {
    if (!isImageUploaded) {
      setCustomPrompt('');
      setIsPresetsOpen(false);
    }
  }, [isImageUploaded]);

  return (
    <div className='flex flex-col space-y-4'>
      <div>
        <h3 className='text-md font-semibold text-slate-600 mb-2'>Presets</h3>
        <div className='relative'>
          <button
            onClick={() => setIsPresetsOpen(!isPresetsOpen)}
            disabled={isGenerating || !isImageUploaded}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between ${isImageUploaded ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700' : 'bg-slate-100 border-slate-200 text-slate-400'}`}
            aria-haspopup='true'
            aria-expanded={isPresetsOpen}
          >
            <span>Choose a Preset...</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className={`h-5 w-5 text-slate-500 transition-transform duration-200 ${isPresetsOpen ? 'rotate-180' : ''}`}
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>
          {isPresetsOpen && (
            <div className='absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg py-1 animate-fade-in-down'>
              <style>{`
                  @keyframes fade-in-down {
                      from { opacity: 0; transform: translateY(-0.5rem); }
                      to { opacity: 1; transform: translateY(0); }
                  }
                  .animate-fade-in-down { animation: fade-in-down 0.2s ease-out; }
              `}</style>
              <div className='grid grid-cols-2 gap-1 p-1'>
                {presets.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      onGenerate(preset.prompt);
                      setIsPresetsOpen(false);
                    }}
                    className='text-sm text-left w-full py-2 px-3 rounded-md transition-colors hover:bg-blue-50 text-slate-700'
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className='text-md font-semibold text-slate-600 mb-2'>
          Smart Placement
        </h3>
        <button
          onClick={() => onGenerate(intelligentPlacementPrompt)}
          disabled={isGenerating || !isImageUploaded}
          className={`w-full text-left p-3 rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between ${isImageUploaded ? 'bg-slate-100 hover:bg-blue-100 hover:border-blue-400 border-slate-200 text-slate-700' : 'bg-slate-100 border-slate-200 text-slate-400'}`}
        >
          <span>Intelligent Placement</span>
          <SparklesIcon className='h-5 w-5 text-blue-500' />
        </button>
      </div>

      <form
        onSubmit={handleCustomSubmit}
        className='flex flex-col space-y-3 pt-2'
      >
        <h3 className='text-md font-semibold text-slate-600 mb-1'>
          Custom Environment
        </h3>
        <textarea
          value={customPrompt}
          onChange={e => setCustomPrompt(e.target.value)}
          placeholder='e.g., On a marble countertop next to a vase of flowers'
          className='w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-slate-100'
          rows={3}
          disabled={isGenerating || !isImageUploaded}
        />
        <button
          type='submit'
          disabled={isGenerating || !isImageUploaded || !customPrompt.trim()}
          className='w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed'
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </form>
    </div>
  );
};

export default PromptControls;
