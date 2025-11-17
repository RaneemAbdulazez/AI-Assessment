
import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';

interface LoginProps {
  onSwitchToSignup: () => void;
  onRequireVerification: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup, onRequireVerification }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        try {
          // Resend verification email, but don't sign out.
          // App.tsx's onAuthStateChanged will see the unverified user and show the correct screen.
          await sendEmailVerification(userCredential.user);
        } catch (verificationError: any) {
          if (verificationError.code !== 'auth/too-many-requests') {
            // Log other errors, but don't block the user from seeing the verification screen.
            console.error("Failed to resend verification email:", verificationError);
          }
        }
        // App.tsx will now handle showing the verification screen.
        return;
      }
      // If verified, onAuthStateChanged listener in App.tsx will handle successful login.
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Password or Email Incorrect');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
              className="block w-full rounded-md border border-slate-300 bg-white py-2.5 px-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
           <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-900">
              Password
            </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border border-slate-300 bg-white py-2.5 px-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
      
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
