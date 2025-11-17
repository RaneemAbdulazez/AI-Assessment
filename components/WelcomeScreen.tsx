
import React from 'react';
import ArrowRightIcon from './icons/ArrowRightIcon';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 w-full max-w-2xl text-center transition-all duration-300 ease-in-out transform hover:scale-[1.01] hover:shadow-xl">
      <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
        AI Readiness Assessment
      </h1>
      <p className="text-slate-600 text-lg mb-8 max-w-prose mx-auto">
        Unlock your company's potential by identifying key areas for AI integration. This assessment will analyze your operations, data, and workflows to provide a clear, actionable roadmap for AI adoption.
      </p>
      <button
        onClick={onStart}
        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
      >
        <span>Start Assessment</span>
        <ArrowRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default WelcomeScreen;
