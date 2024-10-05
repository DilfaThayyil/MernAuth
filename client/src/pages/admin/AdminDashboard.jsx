import React, { useEffect, useState } from 'react';
import axios from 'axios'


const url =  'http://localhost:3000'

export default function AdminDashboard() {
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData =  async() => {
    try {
      const response = await axios.post(`${url}/api/admin/users`);
      setUserData(response.data.userData);
      console.log('aaaaaaaaaaaaa',response.data.userData)
    } catch (error) {
      console.error('Error fetching user data:', error);
      
    }
  };

  return (
    <div className="px-4 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-slate-800">
        Hai Admin!,<br /> Welcome to the Dashboard!
      </h1>

      {/* Display error message if any */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Display fetched user data */}
      {userData.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold mt-8">User Details:</h2>
          <ul className="list-disc list-inside mt-4">
            {userData.map((user) => (
              <li key={user._id} className="mb-2">
                <strong>Name:</strong> {user.username}<br />
                <strong>Email:</strong> {user.email}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}
