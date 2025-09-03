import React, { useState } from 'react';

interface QuickStartGuideProps {
  onClose: () => void;
}

export const QuickStartGuide: React.FC<QuickStartGuideProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Productorr!",
      content: "Let's get you started with creating amazing AI-generated product images.",
      image: "🎉"
    },
    {
      title: "Upload Your Products",
      content: "Start by uploading up to 4 product images. These will be the base for your AI-generated scenes.",
      image: "📸"
    },
    {
      title: "Describe Your Vision",
      content: "Write a detailed prompt describing the environment or setting you want for your product.",
      image: "✍️"
    },
    {
      title: "Generate & Save",
      content: "Click generate and watch AI create professional product images. All images are automatically saved to your gallery.",
      image: "🚀"
    },
    {
      title: "Explore & Share",
      content: "Browse your dashboard, discover community creations, and share your favorite images.",
      image: "🌟"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
              aria-label="Close guide"
            >
              ×
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{steps[currentStep]?.image}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {steps[currentStep]?.title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {steps[currentStep]?.content}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};