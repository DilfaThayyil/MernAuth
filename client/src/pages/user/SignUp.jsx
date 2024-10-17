import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../../components/OAuth'

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage,setSuccessMessage] = useState('')
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); 
    setSuccessMessage('')
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setErrors(data.errors || { general: data.message });
        return;
      }
      setSuccessMessage(data.message)
      setTimeout(()=>navigate('/sign-in'),2000)
    } catch (error) {
      setLoading(false);
      setErrors({ general: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
          type="text" 
          placeholder='Username' 
          id='username' 
          className={`bg-slate-100 p-3 rounded-lg ${errors.username ? 'border-red-500' : ''}`} 
          onChange={handleChange}
        />
        {errors.username && <p className='text-red-500'>{errors.username}</p>}

        <input 
          type="email" 
          placeholder='Email' 
          id='email' 
          className={`bg-slate-100 p-3 rounded-lg ${errors.email ? 'border-red-500' : ''}`} 
          onChange={handleChange}
        />
        {errors.email && <p className='text-red-500'>{errors.email}</p>}

        <input 
          type="password" 
          placeholder='Password' 
          id='password' 
          className={`bg-slate-100 p-3 rounded-lg ${errors.password ? 'border-red-500' : ''}`} 
          onChange={handleChange}
        />
        {errors.password && <p className='text-red-500'>{errors.password}</p>}

        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth/>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/sign-in'>
          <span className='text-blue-500'>Sign in</span>
        </Link>
      </div>

      {errors.general && <p className='text-red-700 mt-5'>{errors.general}</p>}
      {successMessage && <p className='text-green-600 mt-5'>{successMessage}</p> }
    </div>
  );
}
