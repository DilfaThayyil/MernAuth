import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

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
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/admin">
          <Route path="login" element={<AdminLogin />} />
          <Route path="" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
