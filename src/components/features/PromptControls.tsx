import React, { useState, useEffect } from 'react';
import { SparklesIcon } from '@/src/components/ui/icons/SparklesIcon';

interface PromptControlsProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  isImageUploaded: boolean;
}

interface Preset {
  name: string;
  prompt: string;
  category: 'indoor' | 'outdoor' | 'studio';
}

const presets: Preset[] = [
  {
    name: 'Modern Home',
    prompt: 'Place the product(s) in a bright, modern home interior setting with natural lighting.',
    category: 'indoor',
  },
  {
    name: 'Office Desk',
    prompt: 'Place the product(s) on a clean, wooden office desk next to a laptop and coffee cup.',
    category: 'indoor',
  },
  {
    name: 'Cozy Café',
    prompt: 'Place the product(s) on a small table in a cozy, well-lit café with latte art coffee nearby.',
    category: 'indoor',
  },
  {
    name: 'Minimalist Loft',
    prompt: 'Situate the product(s) in a minimalist industrial loft apartment with concrete floors and large windows.',
    category: 'indoor',
  },
  {
    name: 'Beach Setting',
    prompt: 'Place the product(s) on clean sand of a beautiful beach with calm ocean in the background during golden hour.',
    category: 'outdoor',
  },
  {
    name: 'Garden Scene',
    prompt: 'Place the product(s) in a natural outdoor garden setting with soft natural lighting and greenery.',
    category: 'outdoor',
  },
  {
    name: 'Forest Floor',
    prompt: 'Place the product(s) on a mossy forest floor, surrounded by ferns and dappled sunlight.',
    category: 'outdoor',
  },
  {
    name: 'Studio Shot',
    prompt: 'Place the product(s) on a solid color background in a professional photo studio with perfect lighting.',
    category: 'studio',
  },
];

const intelligentPlacementPrompt =
  'Analyze the product image(s) and place them in the most suitable, aesthetically pleasing, and realistic environment that highlights their features and intended use.';

export const PromptControls: React.FC<PromptControlsProps> = ({
  onGenerate,
  isGenerating,
  isImageUploaded,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'indoor' | 'outdoor' | 'studio'>('all');

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

  const filteredPresets = selectedCategory === 'all' 
    ? presets 
    : presets.filter(preset => preset.category === selectedCategory);

  return (
    <div className='flex flex-col space-y-4'>
      {/* Smart Placement */}
      <div>
        <h3 className='text-md font-semibold text-slate-600 mb-2'>
          AI Smart Placement
        </h3>
        <button
          onClick={() => onGenerate(intelligentPlacementPrompt)}
          disabled={isGenerating || !isImageUploaded}
          className={`w-full text-left p-3 rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between ${
            isImageUploaded 
              ? 'bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200 text-slate-700' 
              : 'bg-slate-100 border-slate-200 text-slate-400'
          }`}
        >
          <span className="font-medium">Intelligent Placement</span>
          <SparklesIcon className='h-5 w-5 text-blue-500' />
        </button>
      </div>

      {/* Preset Environments */}
      <div>
        <h3 className='text-md font-semibold text-slate-600 mb-2'>Environment Presets</h3>
        <div className='relative'>
          <button
            onClick={() => setIsPresetsOpen(!isPresetsOpen)}
            disabled={isGenerating || !isImageUploaded}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between ${
              isImageUploaded 
                ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700' 
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
            aria-haspopup='true'
            aria-expanded={isPresetsOpen}
          >
            <span>Choose Environment...</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className={`h-5 w-5 text-slate-500 transition-transform duration-200 ${
                isPresetsOpen ? 'rotate-180' : ''
              }`}
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
            <div className='absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg py-2 animate-fade-in-down'>
              <style>{`
                @keyframes fade-in-down {
                  from { opacity: 0; transform: translateY(-0.5rem); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.2s ease-out; }
              `}</style>
              
              {/* Category Filter */}
              <div className='px-3 pb-2 mb-2 border-b border-slate-100'>
                <div className='flex space-x-1'>
                  {(['all', 'indoor', 'outdoor', 'studio'] as const).map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preset Options */}
              <div className='max-h-64 overflow-y-auto'>
                <div className='grid grid-cols-1 gap-1 px-2'>
                  {filteredPresets.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        onGenerate(preset.prompt);
                        setIsPresetsOpen(false);
                      }}
                      className='text-sm text-left w-full py-2 px-3 rounded-md transition-colors hover:bg-blue-50 text-slate-700 flex items-center justify-between'
                    >
                      <span>{preset.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        preset.category === 'indoor' ? 'bg-green-100 text-green-700' :
                        preset.category === 'outdoor' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {preset.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Environment */}
      <form onSubmit={handleCustomSubmit} className='flex flex-col space-y-3 pt-2'>
        <h3 className='text-md font-semibold text-slate-600 mb-1'>
          Custom Environment
        </h3>
        <textarea
          value={customPrompt}
          onChange={e => setCustomPrompt(e.target.value)}
          placeholder='Describe your ideal environment... e.g., "On a marble countertop next to a vase of flowers in a bright kitchen"'
          className='w-full p-3 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-slate-100 resize-none'
          rows={3}
          disabled={isGenerating || !isImageUploaded}
        />
        <button
          type='submit'
          disabled={isGenerating || !isImageUploaded || !customPrompt.trim()}
          className='w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        >
          {isGenerating ? 'Generating...' : 'Generate Custom Scene'}
        </button>
      </form>
    </div>
  );
};