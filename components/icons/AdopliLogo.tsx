
import React from 'react';

const AdopliLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <div className="flex items-center space-x-2">
             <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-indigo-600"
            >
                <path
                    d="M16 3L3 9.75V22.25L16 29L29 22.25V9.75L16 3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M16 17.5L3 11V21L16 27.5V17.5Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                 <path
                    d="M16 17.5L29 11V21L16 27.5V17.5Z"
                    fill="currentColor"
                    fillOpacity="0.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                 <path
                    d="M3.5 10.5L16 17.5L28.5 10.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                 <path
                    d="M16 3V17.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <span className="text-2xl font-bold text-slate-800">Adopli AI</span>
        </div>
    );
};

export default AdopliLogo;
