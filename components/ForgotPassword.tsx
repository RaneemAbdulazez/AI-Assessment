import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface ForgotPasswordProps {
  onSwitchToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Password reset link sent! Please check your email.');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
        setError('Could not find an account with that email address.');
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
        Reset Password
      </h2>
      <p className="text-center text-slate-600 mb-8">
        Enter your email to receive a password reset link.
      </p>
      {successMessage ? (
        <div className="text-center">
            <p role="status" className="p-4 bg-green-100 text-green-800 rounded-md text-sm">{successMessage}</p>
             <button
                onClick={onSwitchToLogin}
                className="mt-6 font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-2 mx-auto"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Back to Login</span>
            </button>
        </div>
      ) : (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="reset-email" className="block text-sm font-medium leading-6 text-slate-900">
                Email address
                </label>
                <div className="mt-2">
                <input
                    id="reset-email"
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
                <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                >
                {loading ? 'Sending link...' : 'Send Reset Link'}
                </button>
            </div>
            </form>
            {error && <p role="alert" className="mt-4 text-center text-sm text-red-600">{error}</p>}
            <div className="mt-8 text-center">
              <button
                onClick={onSwitchToLogin}
                className="font-medium text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-2 mx-auto"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Back to Login</span>
              </button>
            </div>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
