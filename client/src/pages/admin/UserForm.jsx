
import React, { useState, useEffect } from 'react';

export default function UserForm({ onSubmit, onClose, user }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setProfilePicture(user.profilePicture || '');
    } else {
      setUsername('');
      setEmail('');
      setProfilePicture('');
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, email, profilePicture });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Username</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          className="border rounded w-full px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="border rounded w-full px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Profile Picture URL</label>
        <input 
          type="text" 
          value={profilePicture} 
          onChange={(e) => setProfilePicture(e.target.value)} 
          className="border rounded w-full px-3 py-2"
        />
      </div>
      <div className="flex justify-between">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {user ? 'Update User' : 'Create User'}
        </button>
        <button type="button" onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
          Cancel
        </button>
      </div>
    </form>
  );
}
