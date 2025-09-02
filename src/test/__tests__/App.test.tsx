import { describe, it, expect } from 'vitest';

import App from '@/src/app/App';

import { render, screen } from '../utils';

describe('App', () => {
  it('renders login page by default', () => {
    render(<App />);
    
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByText('Product In-Situ Placer')).toBeInTheDocument();
  });

  it('has proper navigation buttons', () => {
    render(<App />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
});