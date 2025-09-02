import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L15 12l-2.293-2.293a1 1 0 010-1.414L15 6m-5 16l2.293-2.293a1 1 0 011.414 0L15 18l-2.293 2.293a1 1 0 01-1.414 0L9 18m9-12l-2.293 2.293a1 1 0 01-1.414 0L15 6l2.293-2.293a1 1 0 011.414 0L21 6'
    />
  </svg>
);

export default SparklesIcon;
