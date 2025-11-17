import React, { useState, useEffect } from 'react';
import { User, updateProfile, deleteUser } from 'firebase/auth';
import { UserProfile } from '../types';
import { db, doc, updateDoc, deleteDoc, auth } from '../firebase';
import UserIcon from './icons/UserIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import Spinner from './icons/Spinner';

interface ProfileModalProps {
  user: User;
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedData: Partial<UserProfile>) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, userProfile, isOpen, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(userProfile.name);
      setIsEditing(false);
      setError('');
      setLoading(false);
      setDeleteLoading(false);
    }
  }, [isOpen, userProfile.name]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { name });
      await updateProfile(user, { displayName: name });
      onUpdate({ name });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      setDeleteLoading(true);
      setError('');
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await deleteDoc(userDocRef);
        await deleteUser(user);
        // onAuthStateChanged will handle logout and UI update
        onClose();
      } catch (err: any) {
        if (err.code === 'auth/requires-recent-login') {
          setError('For security, please sign out and sign back in before deleting your account.');
        } else {
          console.error("Failed to delete account:", err);
          setError('Failed to delete account. Please try again.');
        }
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" 
        onClick={onClose} 
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md m-4 relative transform transition-all" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            aria-label="Close profile modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            {userProfile.photoURL ? (
              <img src={userProfile.photoURL} alt="Profile" className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-200" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center ring-4 ring-slate-200">
                <UserIcon className="w-12 h-12 text-slate-500" />
              </div>
            )}
          </div>
          
          <div className="text-center w-full">
            {isEditing ? (
              <form onSubmit={handleUpdate} className="w-full">
                <h2 id="profile-modal-title" className="text-2xl font-bold text-slate-900 mb-4">Edit Profile</h2>
                <div>
                  <label htmlFor="profile-name" className="sr-only">Full Name</label>
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-center text-xl font-medium rounded-md border border-slate-300 bg-white py-2 px-3 text-slate-900 shadow-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
                <p className="text-sm text-slate-500 mt-2 mb-4">{user.email}</p>
                <div className="flex items-center justify-center gap-4">
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center w-28">
                        {loading ? <Spinner /> : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200">
                        Cancel
                    </button>
                </div>
              </form>
            ) : (
              <>
                <h2 id="profile-modal-title" className="text-3xl font-bold text-slate-900 flex items-center gap-3 justify-center">
                    {userProfile.name}
                    <button onClick={() => setIsEditing(true)} aria-label="Edit name" className="text-slate-400 hover:text-indigo-600">
                        <PencilIcon className="w-5 h-5" />
                    </button>
                </h2>
                <p className="text-slate-500 mt-1">{user.email}</p>
              </>
            )}
          </div>
        </div>

        {error && <p role="alert" className="mt-4 text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
        
        <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Account Actions</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">Permanently delete your account and all associated data.</p>
            <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 font-semibold rounded-lg hover:bg-red-100 disabled:opacity-50"
            >
                {deleteLoading ? <Spinner className="text-red-700"/> : <TrashIcon className="w-5 h-5"/>}
                <span>Delete Account</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
