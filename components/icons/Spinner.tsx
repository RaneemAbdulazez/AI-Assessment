import React from 'react';

const Spinner: React.FC<{ className?: string }> = ({ className = 'text-white' }) => (
    <div 
        className={`animate-spin rounded-full h-5 w-5 border-b-2 ${className}`}
        style={{ borderColor: 'currentColor' }}
        role="status" 
        aria-live="polite"
    >
        <span className="sr-only">Loading...</span>
    </div>
);

export default Spinner;