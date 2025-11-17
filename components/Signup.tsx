import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, googleProvider, db, setDoc, doc } from '../firebase';
import { UserProfile } from '../types';
import GoogleIcon from './icons/GoogleIcon';


interface SignupProps {
  onSwitchToLogin: () => void;
  onRequireVerification: (email: string) => void;
}

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin, onRequireVerification }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== repeatPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update auth profile
      await updateProfile(user, { displayName: name });
      
      // Create user profile in Firestore
      const newUserProfile: UserProfile = {
        uid: user.uid,
        name: name,
        email: user.email!,
        photoURL: null
      };
      await setDoc(doc(db, "users", user.uid), newUserProfile);
      
      try {
        await sendEmailVerification(userCredential.user);
      } catch (verificationError: any) {
        if (verificationError.code !== 'auth/too-many-requests') {
           console.error("Failed to send initial verification email:", verificationError);
        }
      }
      onRequireVerification(email);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('User already exists.');
      } else {
        setError('Failed to create an account. Please try again.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged in App.tsx will handle the redirect and Firestore doc creation
    } catch (err: any) {
       // Handle common errors like popup closed by user
       if (err.code !== 'auth/popup-closed-by-user') {
        setError('Failed to sign up with Google. Please try again.');
        console.error(err);
      }
    } finally {
      setGoogleLoading(false);
    }
  };


  const renderError = () => {
    if (!error) return null;
    if (error === 'User already exists.') {
      return (
        <p role="alert" className="mt-4 text-center text-sm text-red-600">
          {error}{' '}
          <button onClick={onSwitchToLogin} className="font-medium underline hover:text-red-500">
            Sign in?
          </button>
        </p>
      );
    }
    return <p role="alert" className="mt-4 text-center text-sm text-red-600">{error}</p>;
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
        Create an Account
      </h2>
      <p className="text-center text-slate-600 mb-8">
        Get started with your AI Readiness Assessment.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-slate-900">Full Name</label>
          <input id="name" name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 block w-full rounded-md border border-slate-300 bg-white py-2.5 px-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium leading-6 text-slate-900">Email address</label>
          <input id="signup-email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 block w-full rounded-md border border-slate-300 bg-white py-2.5 px-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
        <div>
          <label htmlFor="signup-password"className="block text-sm font-medium leading-6 text-slate-900">Password</label>
          <input id="signup-password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 block w-full rounded-md border border-slate-300 bg-white py-2.5 px-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6" aria-describedby="password-help"/>
          <p className="mt-1 text-xs text-slate-500" id="password-help">Must be at least 6 characters long.</p>
        </div>
        <div>
          <label htmlFor="repeat-password"className="block text-sm font-medium leading-6 text-slate-900">Repeat Password</label>
          <input id="repeat-password" name="repeat-password" type="password" required value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} className="mt-2 block w-full rounded-md border border-slate-300 bg-white py-2.5 px-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
        
        <div>
          <button type="submit" disabled={loading || googleLoading} className="mt-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Create Account'}
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
          {googleLoading ? 'Redirecting...' : 'Sign up with Google'}
        </button>
      </div>


      {renderError()}

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign in
        </button>
      </p>
    </div>
  );
};

export default Signup;