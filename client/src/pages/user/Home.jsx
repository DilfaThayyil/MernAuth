import React from 'react';

export default function Home() {
  return (
    <div className='px-4 py-12 max-w-2xl mx-auto'>
      <h1 className='text-3xl font-bold mb-4 text-slate-800'>
        Welcome ...!
      </h1>
      <p className='mb-4 text-slate-700'>What's Up ?</p>
      <p className='mb-4 text-slate-700'>Thrilled to know about this App !?</p>
      <p className='mb-4 text-slate-700'>
        Our Auth App not only enables you to manage your account effortlessly but also ensures that your data remains secure and private. Experience the ease of managing your authentication needs!
      </p>
      <h2 className='text-2xl font-semibold mb-4'>Features</h2>
      <ul className='list-disc pl-5 mb-4'>
        <li>🔐  Sign Up and Log In Functionality</li>
        <li>🛡️  Protected Routes</li>
        <li>📬  Real-Time Notifications</li>
        <li>👤  User Profile Management</li>
      </ul>
    </div>
  );
}
