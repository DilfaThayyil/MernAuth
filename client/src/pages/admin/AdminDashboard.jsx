import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Modal';
import UserForm from './UserForm';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const url = 'http://localhost:3000';

export default function AdminDashboard() {
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchUserData = async () => {
    try {
      const response = await axios.post(`${url}/api/admin/users`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admintoken')}`,
        },
      });
      setUserData(response.data.userData);
    } catch (error) {
      setError('Error fetching user data: ' + error.message);
      toast.error('Error fetching user data: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${url}/api/admin/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('admintoken')}`,
            },
          });
          setUserData(userData.filter((user) => user._id !== userId));
          toast.success('User deleted successfully!');
          MySwal.fire('Deleted!', 'User has been deleted.', 'success');
        } catch (error) {
          toast.error('Error deleting user: ' + error.message);
          MySwal.fire('Error!', 'There was an error deleting the user.', 'error');
        }
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('admintoken');
    navigate('/admin/login');
  };

  const handleOpenModal = (user = null) => {
    setCurrentUser(user);
    setModalOpen(true);
    setSuccessMessage('');
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
        setSuccessMessage('User updated successfully');
        toast.success('User updated successfully!');
      } else {
        await axios.post(`${url}/api/admin/createUsers`, user, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admintoken')}`,
          },
        });
        setSuccessMessage('User created successfully');
        toast.success('User created successfully!');
      }
      fetchUserData();
      handleCloseModal();
    } catch (error) {
      toast.error('Error saving user: ' + error.message);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = userData.filter((user) =>
    (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="px-4 py-12 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:border-indigo-500"
          placeholder="Search by username or email"
          value={searchQuery}
          onChange={handleSearch}
        />
        <button
          className="ml-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 shadow"
          onClick={() => handleOpenModal()}
        >
          Create User
        </button>
      </div>

      {successMessage && (
        <div className="mb-4 p-2 text-green-600 bg-green-100 rounded">
          {successMessage}
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}

      {filteredUsers.length > 0 ? (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b px-4 py-2 text-left text-gray-600">Profile Picture</th>
                <th className="border-b px-4 py-2 text-left text-gray-600">Username</th>
                <th className="border-b px-4 py-2 text-left text-gray-600">Email</th>
                <th className="border-b px-4 py-2 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-2">
                    <img src={user.profilePicture} alt="profile" className="w-12 h-12 rounded-full object-cover" />
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

      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={currentUser ? 'Edit User' : 'Create User'}>
        <UserForm onSubmit={handleSubmit} onClose={handleCloseModal} user={currentUser} />
      </Modal>
    </div>
  );
}
