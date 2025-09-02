import React, { useState } from 'react';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/src/config';

interface RegisterPageProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email.trim() || !formData.password.trim() || !formData.firstName.trim()) {
      return 'Please fill out all required fields.';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.';
    }

    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address.';
    }

    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock Registration - In production, this would be a real API call
      console.log('Mock registration successful for:', formData.email);
      onRegisterSuccess();
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-200'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-slate-900'>
            Create your account
          </h2>
          <p className='mt-2 text-center text-sm text-slate-600'>
            Join thousands of users creating amazing product placements
          </p>
        </div>
        
        <form className='mt-8 space-y-6' onSubmit={handleRegister}>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label htmlFor='firstName' className='block text-sm font-medium text-slate-700 mb-1'>
                  First Name *
                </label>
                <input
                  id='firstName'
                  name='firstName'
                  type='text'
                  autoComplete='given-name'
                  required
                  className='appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white'
                  placeholder='John'
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor='lastName' className='block text-sm font-medium text-slate-700 mb-1'>
                  Last Name
                </label>
                <input
                  id='lastName'
                  name='lastName'
                  type='text'
                  autoComplete='family-name'
                  className='appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white'
                  placeholder='Doe'
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor='email-address' className='block text-sm font-medium text-slate-700 mb-1'>
                Email address *
              </label>
              <input
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                required
                className='appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white'
                placeholder='john@example.com'
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-slate-700 mb-1'>
                Password *
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='new-password'
                required
                className='appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white'
                placeholder='Minimum 8 characters'
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor='confirm-password' className='block text-sm font-medium text-slate-700 mb-1'>
                Confirm Password *
              </label>
              <input
                id='confirm-password'
                name='confirmPassword'
                type='password'
                autoComplete='new-password'
                required
                className='appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white'
                placeholder='Repeat your password'
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className='bg-red-50 border border-red-200 rounded-md p-3'>
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          )}

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {isLoading ? (
                <div className='flex items-center'>
                  <svg className='animate-spin -ml-1 mr-3 h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
        
        <div className='text-center'>
          <p className='text-sm text-slate-600'>
            Already have an account?{' '}
            <button
              onClick={onNavigateToLogin}
              className='font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline'
              disabled={isLoading}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};