import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Modal'; 
import UserForm from './UserForm'; 




const url = 'http://localhost:3000';

export default function AdminDashboard() {
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    console.log('AdminDashboard mounted');
    fetchUserData();
  }, []);
  
  const fetchUserData = async () => {
    try {
      const response = await axios.post(`${url}/api/admin/users`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admintoken')}`,
        },
      });
      console.log('API response:', response.data);
      setUserData(response.data.userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Error fetching user data: ' + error.message);
      toast.error('Error fetching user data: ' + error.message);
    }
  };
  



  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${url}/api/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admintoken')}`,
          },
        });
        setUserData(userData.filter(user => user._id !== userId));
        toast.success('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Error deleting user: ' + error.message);
      }
    }
  };



  const handleLogout = () => {
    localStorage.removeItem('admintoken');
    navigate('/admin/login');
  };

  const handleOpenModal = (user = null) => {
    setCurrentUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentUser(null);
    setModalOpen(false);
  };

  const handleSubmit = async (user) => {
    try {
      if (currentUser) {
        await axios.put(`${url}/api/admin/users/${currentUser._id}`, user, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admintoken')}`,
          },
        });
        toast.success('User updated successfully!');
      } else {
        await axios.post(`${url}/api/auth/signup`, user, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admintoken')}`,
          },
        });
        toast.success('User created successfully!');
      }
      fetchUserData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Error saving user: ' + error.message);
    }
  };

  return (
    <div className="px-4 py-12 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button 
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" 
        onClick={() => handleOpenModal()}
      >
        Create User
      </button>

      {userData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b px-4 py-2 text-left text-gray-600">Profile Picture</th>
                <th className="border-b px-4 py-2 text-left text-gray-600">Username</th>
                <th className="border-b px-4 py-2 text-left text-gray-600">Email</th>
                <th className="border-b px-4 py-2 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-2">
                    <img src={user.profilePicture} alt={user.username} className="w-12 h-12 rounded-full" />
                  </td>
                  <td className="border-b px-4 py-2">{user.username}</td>
                  <td className="border-b px-4 py-2">{user.email}</td>
                  <td className="border-b px-4 py-2">
                    <button 
                      onClick={() => handleOpenModal(user)} 
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user._id)} 
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No users found.</p>
      )}

      <Modal 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
        title={currentUser ? 'Edit User' : 'Create User'}
      >
        <UserForm 
          onSubmit={handleSubmit} 
          onClose={handleCloseModal} 
          user={currentUser} 
        />
      </Modal>
    </div>
  );
}
