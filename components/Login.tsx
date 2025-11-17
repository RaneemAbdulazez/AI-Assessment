import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendEmailVerification, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import GoogleIcon from './icons/GoogleIcon';

interface LoginProps {
  onSwitchToSignup: () => void;
  onRequireVerification: (email: string) => void;
  onSwitchToForgot: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup, onRequireVerification, onSwitchToForgot }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [hasCredentialError, setHasCredentialError] = useState(false);

  const handleInputFocus = () => {
    if (error) setError('');
    if (hasCredentialError) setHasCredentialError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setHasCredentialError(false);
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        try {
          await sendEmailVerification(userCredential.user);
        } catch (verificationError: any) {
          if (verificationError.code !== 'auth/too-many-requests') {
            console.error("Failed to resend verification email:", verificationError);
          }
        }
        onRequireVerification(email);
        return;
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Password or Email Incorrect');
        setHasCredentialError(true);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged in App.tsx will handle the redirect
    } catch (err: any) {
      // Handle common errors like popup closed by user
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Failed to sign in with Google. Please try again.');
        console.error(err);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const baseInputClasses = "block w-full rounded-md border bg-white py-2.5 px-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 sm:text-sm sm:leading-6";
  const normalInputClasses = "border-slate-300 focus:border-indigo-600 focus:ring-indigo-600";
  const errorInputClasses = "border-red-500 text-red-900 focus:border-red-500 focus:ring-red-500";
  const inputClassName = `${baseInputClasses} ${hasCredentialError ? errorInputClasses : normalInputClasses}`;

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
        Welcome Back
      </h2>
      <p className="text-center text-slate-600 mb-8">
        Sign in to continue your assessment.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleInputFocus}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
           <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-900">
                Password
              </label>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={onSwitchToForgot}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </button>
              </div>
            </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handleInputFocus}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
      
      <div className="my-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-slate-500">OR</span>
          </div>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50"
        >
          <GoogleIcon className="h-5 w-5" />
          {googleLoading ? 'Redirecting...' : 'Sign in with Google'}
        </button>
      </div>

      {error && <p role="alert" className="mt-4 text-center text-sm text-red-600">{error}</p>}

      <p className="mt-8 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <button onClick={onSwitchToSignup} className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login;