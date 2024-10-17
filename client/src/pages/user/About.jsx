import React from 'react';

export default function About() {
  return (
    <div className='px-4 py-12 max-w-2xl mx-auto rounded-lg shadow-lg'>
      <h1 className='text-4xl font-bold mb-6 text-center text-gray-800'>🌟 About This Amazing App</h1>
      <p className='mb-4 text-gray-700'>
        Hey there! Welcome to our little corner of the web, where we’ve crafted a cool MERN stack application just for you.
      </p>
      <p className='mb-4 text-gray-700'>
        Built on the powerful <strong>MERN stack</strong> (that’s MongoDB, Express, React, and Node.js), this app is designed to
        give you a seamless experience. With <strong>React Router</strong>, you can jump around the app like it’s a breeze,
        while our backend works tirelessly behind the scenes to keep things running smoothly.
      </p>
      <p className='mb-4 text-gray-700'>
        Your security is our priority! We use <strong>JSON Web Tokens (JWT)</strong> to keep your data safe, so you can focus on what
        matters most—having fun and getting things done!
      </p>
      <p className='mb-4 text-gray-700'>
        Whether you're diving into full-stack development or just want to explore the MERN stack, this application is the perfect 
        starting point. Feel free to tinker, experiment, and make it your own. It’s all about creativity and learning!
      </p>
      <p className='text-gray-700 text-center italic'>
        Ready? Let’s get started!🤞
      </p>
    </div>
  );
}
