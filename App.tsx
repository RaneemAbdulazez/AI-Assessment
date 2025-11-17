
import React, { useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth, db, doc, getDoc, setDoc } from './firebase';

import { AssessmentStep, UserProfile } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import AssessmentPlaceholder from './components/AssessmentPlaceholder';
import AdopliLogo from './components/icons/AdopliLogo';
import AuthScreen from './components/AuthScreen';
import LogoutIcon from './components/icons/LogoutIcon';
import UserIcon from './components/icons/UserIcon';
import ProfileModal from './components/ProfileModal';
import { AuthView } from './components/AuthScreen';

const AssessmentContent: React.FC<{ 
  onLogout: () => void, 
  user: User, 
  userProfile: UserProfile | null,
  onOpenProfile: () => void 
}> = ({ onLogout, user, userProfile, onOpenProfile }) => {
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
      <header className="w-full max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <AdopliLogo />
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="font-semibold text-slate-800">{userProfile?.name || 'User'}</div>
            <div className="text-xs text-slate-500">{user.email}</div>
          </div>
          <button onClick={onOpenProfile} aria-label="Open profile" className="flex-shrink-0">
            {userProfile?.photoURL ? (
              <img src={userProfile.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover ring-2 ring-offset-2 ring-indigo-200" />
            ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center ring-2 ring-offset-2 ring-slate-200">
                <UserIcon className="w-6 h-6 text-slate-500" />
                </div>
            )}
          </button>
          <button 
            onClick={onLogout} 
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors"
            aria-label="Logout"
          >
            <LogoutIcon className="w-6 h-6" />
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data() as UserProfile);
        } else {
          // This case handles new Google sign-ins or existing auth users without a Firestore doc
          const newUserProfile: UserProfile = {
            uid: currentUser.uid,
            name: currentUser.displayName || 'New User',
            email: currentUser.email!,
            photoURL: currentUser.photoURL || null,
          };
          await setDoc(userDocRef, newUserProfile);
          setUserProfile(newUserProfile);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).catch(error => console.error("Logout failed", error));
  };
  
  const handleProfileUpdate = (updatedData: Partial<UserProfile>) => {
    if(userProfile) {
      setUserProfile({ ...userProfile, ...updatedData });
    }
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
      return (
        <>
          <AssessmentContent 
            onLogout={handleLogout} 
            user={user} 
            userProfile={userProfile}
            onOpenProfile={() => setProfileModalOpen(true)}
          />
          {isProfileModalOpen && user && userProfile && (
            <ProfileModal
              user={user}
              userProfile={userProfile}
              isOpen={isProfileModalOpen}
              onClose={() => setProfileModalOpen(false)}
              onUpdate={handleProfileUpdate}
            />
          )}
        </>
      );
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