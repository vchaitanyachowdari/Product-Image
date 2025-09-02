import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ErrorBoundary } from '@/src/components/common';

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };