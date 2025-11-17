import React from 'react';
import MailIcon from './icons/MailIcon';

interface EmailVerificationProps {
  email: string;
  onSwitchToLogin: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ email, onSwitchToLogin }) => {
  return (
    <div className="w-full text-center">
      <div className="flex justify-center mb-6">
        <MailIcon className="w-16 h-16 text-indigo-500" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">
        Verify Your Email
      </h2>
      <p className="text-slate-600 mb-6">
        We've sent a verification link to{' '}
        <strong className="text-slate-800">{email}</strong>. Please check your
        inbox and click the link to activate your account.
      </p>
      <button
        onClick={onSwitchToLogin}
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Go to Login
      </button>
    </div>
  );
};

export default EmailVerification;
