import React, { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import OAuth from '../../components/OAuth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'


export default function SignUp() {
  const [formData,setFormData] = useState({})
  const [error,setError] = useState(false)
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]: e.target.value})
  }


  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters'),
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain one uppercase letter, one lowercase letter, one number, and one special character'
      ),
  });

  const {
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      setLoading(true)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data)
      setLoading(false)
      if(data.success===false){
        setError(true)
        return
      }
      navigate('/sign-in')
    } catch (error) {
      setLoading(false)
      setError(true)
    }
  };
  

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='Username' id='username' className='bg-slate-100 p-3 rounded-lg' {...register('username')} onChange={handleChange}/>
        {errors.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}
        <input type="email" placeholder='Email' id='email' className='bg-slate-100 p-3 rounded-lg' {...register('email')} onChange={handleChange}/>
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        <input type="password" placeholder='Password' id='password' className='bg-slate-100 p-3 rounded-lg' {...register('password')} onChange={handleChange}/>
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
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
      <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
    </div>
  )
}
