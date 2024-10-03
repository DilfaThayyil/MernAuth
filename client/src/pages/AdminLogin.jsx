import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminSignInStart, adminSignInSuccess, adminSignInFailure } from '../redux/admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading, error } = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      dispatch(adminSignInStart());
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.success === false) {
        dispatch(adminSignInFailure(data));
        return;
      }
  
      dispatch(adminSignInSuccess({ user: data.user, isAdmin: data.isAdmin }));
      navigate('/admin/dashboard'); 
  
    } catch (error) {
      dispatch(adminSignInFailure(error));
    }
  };
  

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Admin Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type="email"
          placeholder='Email'
          id='email'
          className='bg-slate-100 p-3 rounded-lg'
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder='Password'
          id='password'
          className='bg-slate-100 p-3 rounded-lg'
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
      
      {error && <p className='text-red-700 mt-5'>{error}</p>}
    </div>
  );
}
