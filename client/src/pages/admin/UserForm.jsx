import React, { useState, useEffect, useRef } from 'react';
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'; 
import {app} from '../../firebase'
import { getDownloadURL,getStorage,ref,uploadBytesResumable } from 'firebase/storage';


export default function UserForm({ onSubmit, onClose, user }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [profilePicture,setProfilePicture] = useState('')
  const [imagePercent,setImagePercent] = useState(0)
  const [imageError,setImageError] = useState(false)
  const [errors,setErrors] = useState({})
  const fileRef = useRef(null)

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setPassword(user.password || '')
      setProfilePicture(user.profilePicture || '')
    } else {
      setUsername('');
      setEmail('');
      setPassword('')
      setProfilePicture('')
    }
  }, [user]);

  const handleFileUpload = async(file)=>{
    const storage = getStorage()
    const fileName = new Date().getTime()+file.name
    const storageRef = ref(storage,fileName)
    const uploadTask = uploadBytesResumable(storageRef,file)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
        toast.error('Error uploading image');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProfilePicture(downloadURL);
          toast.success('Image uploaded successfully');
        });
      }
    );
  }

  const validateForm = ()=>{
    const newErrors = {}
    if(!username.trim()){
      newErrors.username = 'Username is required'
    }else if (!/^[a-zA-Z0-9]+$/.test(username)) {
      newErrors.username = 'Username should be alphanumeric';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!user && !password) {
      newErrors.password = 'Password is required';
    } else if (password && password.length < 8) {
      newErrors.password = 'Password should be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character';
    }
    return newErrors
  }

  

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      onSubmit({ username, email, password , profilePicture});
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Profile Picture</label>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files[0])}
        />
        <div className="flex items-center gap-4">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover cursor-pointer"
              onClick={() => fileRef.current.click()}
            />
          ) : (
            <span className="text-gray-500 cursor-pointer" onClick={() => fileRef.current.click()}>
              Click to upload image
            </span>
          )}
        </div>

        {imagePercent > 0 && imagePercent < 100 && (
          <p className="text-sm text-gray-500">Uploading: {imagePercent}%</p>
        )}
        {imageError && <p className="text-red-500">Error uploading image</p>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Username</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          className="border rounded w-full px-3 py-2"
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
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
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Password</label>
        <input 
          type="text" 
          
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className="border rounded w-full px-3 py-2"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
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
