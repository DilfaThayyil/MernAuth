import React, { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { signInStart,signInSuccess,signInFailure } from '../../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import OAuth from '../../components/OAuth'



export default function SignIn() {
  const [formData,setFormData] = useState({})
  const [successMessage,setSuccessMessage] = useState("")
  const {loading,error} = useSelector((state)=>state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]: e.target.value})
  }

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordPattern.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!validateEmail(formData.email)) {
      return dispatch(signInFailure({ message: 'Invalid email format' }));
    }

    if (!validatePassword(formData.password)) {
      return dispatch(signInFailure({ message: 'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one digit, and one special character.' }));
    }

    try {
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success===false){
        dispatch(signInFailure(data))
        return
      }
      dispatch(signInSuccess(data))
      setSuccessMessage("User successfully signed in!")
      setTimeout(() => {
        navigate('/');
    }, 2000)
    } catch (error) {
      dispatch(signInFailure(error))
    }
  };
  

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="email" placeholder='Email' id='email' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>
        <input type="password" placeholder='Password' id='password' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont Have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-500'>Sign up</span>
        </Link>
      </div>
      <p className='text-red-700 mt-5'>{error ? error.message ||'Something went wrong!' : ''}</p>
      {successMessage && (
        <p className='text-green-700 mt-5'>{successMessage}</p> // Display success message
      )}
    </div>
  )
}
