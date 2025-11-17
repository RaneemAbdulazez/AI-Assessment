
import React, { useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from './firebase';

import { AssessmentStep } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import AssessmentPlaceholder from './components/AssessmentPlaceholder';
import AdopliLogo from './components/icons/AdopliLogo';
import AuthScreen from './components/AuthScreen';
import LogoutIcon from './components/icons/LogoutIcon';
import { AuthView } from './components/AuthScreen';

const AssessmentContent: React.FC<{ onLogout: () => void, user: User }> = ({ onLogout, user }) => {
  const [currentStep, setCurrentStep] = useState<AssessmentStep>(AssessmentStep.Welcome);

  const startAssessment = useCallback(() => {
    setCurrentStep(AssessmentStep.CompanyProfile);
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case AssessmentStep.Welcome:
        return <WelcomeScreen onStart={startAssessment} />;
      case AssessmentStep.CompanyProfile:
        return <AssessmentPlaceholder title="Step 1: Company Profile" />;
      // Future steps would be added here
      default:
        return <WelcomeScreen onStart={startAssessment} />;
    }
  };

  return (
    <>
      <header className="w-full max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <AdopliLogo />
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 hidden sm:block" aria-label="user email">{user.email}</span>
          <button 
            onClick={onLogout} 
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors"
            aria-label="Logout"
          >
            <LogoutIcon className="w-5 h-5" />
            <span className="hidden md:block">Logout</span>
          </button>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center w-full">
        {renderStep()}
      </main>
      <footer className="w-full text-center p-4 text-xs text-slate-400">
        &copy; 2025 Adopli AI. All rights reserved.
      </footer>
    </>
  );
};


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).catch(error => console.error("Logout failed", error));
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen" aria-label="Loading application">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (user && user.emailVerified) {
      return <AssessmentContent onLogout={handleLogout} user={user} />;
    }

    const initialView: AuthView = user && !user.emailVerified ? 'verify' : 'login';
    const verificationEmail: string = user && !user.emailVerified ? user.email || '' : '';
    
    return (
      <>
          <header className="w-full max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <AdopliLogo />
          </header>
          <main className="flex-grow flex items-center justify-center w-full">
              <AuthScreen initialView={initialView} verificationEmail={verificationEmail} />
          </main>
          <footer className="w-full text-center p-4 text-xs text-slate-400">
              &copy; 2025 Adopli AI. All rights reserved.
          </footer>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-slate-50 text-slate-800 font-sans">
      {renderContent()}
    </div>
  );
};

export default App;
