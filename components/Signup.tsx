import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      try {
        await sendEmailVerification(userCredential.user);
      } catch (verificationError: any) {
        if (verificationError.code !== 'auth/too-many-requests') {
           // Log other errors, but don't block the user from seeing the verification screen.
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
          <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 block w-full rounded-md border border-slate-300 bg-white py-2.5 px-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium leading-6 text-slate-900">Email address</label>
          <input id="signup-email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 block w-full rounded-md border border-slate-300 bg-white py-2.5 px-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
        <div>
          <label htmlFor="signup-password"className="block text-sm font-medium leading-6 text-slate-900">Password</label>
          <input id="signup-password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 block w-full rounded-md border border-slate-300 bg-white py-2.5 px-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
        <div>
          <label htmlFor="repeat-password"className="block text-sm font-medium leading-6 text-slate-900">Repeat Password</label>
          <input id="repeat-password" name="repeat-password" type="password" required value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} className="mt-2 block w-full rounded-md border border-slate-300 bg-white py-2.5 px-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
        <div>
          <label htmlFor="photo" className="block text-sm font-medium leading-6 text-slate-900">Profile Photo</label>
          <input id="photo" name="photo" type="file" className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
        </div>
        <div>
          <button type="submit" disabled={loading} className="mt-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Sign up'}
          </button>
        </div>
      </form>

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