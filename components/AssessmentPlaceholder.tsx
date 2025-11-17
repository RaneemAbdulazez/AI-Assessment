
import React from 'react';

interface AssessmentPlaceholderProps {
  title: string;
}

const AssessmentPlaceholder: React.FC<AssessmentPlaceholderProps> = ({ title }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 w-full max-w-2xl text-center">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">{title}</h2>
      <p className="text-slate-500">
        Assessment questions and inputs will be displayed here in the next steps.
      </p>
    </div>
  );
};

export default AssessmentPlaceholder;
