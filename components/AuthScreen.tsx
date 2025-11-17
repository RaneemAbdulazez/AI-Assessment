
import React, { useState, useCallback, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Login from './Login';
import Signup from './Signup';
import EmailVerification from './EmailVerification';

export type AuthView = 'login' | 'signup' | 'verify';

interface AuthScreenProps {
  initialView?: AuthView;
  verificationEmail?: string;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ initialView = 'login', verificationEmail: initialEmail = '' }) => {
    const [view, setView] = useState<AuthView>(initialView);
    const [verificationEmail, setVerificationEmail] = useState<string>(initialEmail);

    useEffect(() => {
        setView(initialView);
        if (initialEmail) {
            setVerificationEmail(initialEmail);
        }
    }, [initialView, initialEmail]);

    const switchToSignup = useCallback(() => setView('signup'), []);

    const switchToLogin = useCallback(() => {
        if (view === 'verify') {
            // Sign out the unverified user to allow them to try again.
            signOut(auth);
        }
        setView('login');
    }, [view]);
    
    const requireVerification = useCallback((email: string) => {
        setVerificationEmail(email);
        setView('verify');
    }, []);

    const renderContent = () => {
        switch (view) {
            case 'signup':
                return <Signup onSwitchToLogin={switchToLogin} onRequireVerification={requireVerification} />;
            case 'verify':
                return <EmailVerification email={verificationEmail} onSwitchToLogin={switchToLogin} />;
            case 'login':
            default:
                return <Login onSwitchToSignup={switchToSignup} onRequireVerification={requireVerification} />;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 w-full max-w-md transition-all duration-300">
            {renderContent()}
        </div>
    );
};

export default AuthScreen;
