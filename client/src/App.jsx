import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/user/Home';
import About from './pages/user/About';
import SignIn from './pages/user/SignIn';
import SignUp from './pages/user/SignUp';
import Profile from './pages/user/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PublicRoute from './components/PublicRoute';
import AdminRoute from './components/AdminRoute';


const ConditionalHeader = () => {
  const location = useLocation();
  
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return !isAdminRoute ? <Header /> : null;
};

export default function App() {
  return (
    <BrowserRouter>
      <ConditionalHeader />
      <Routes>
        <Route element={<PublicRoute/>}>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>
        <Route path="/admin">
          <Route path="login" element={<AdminLogin />} />
          <Route element={<AdminRoute/>}>
            <Route path="" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
