import React from 'react'
import Navbar from './components/Navbar.jsx'
import {Routes,Route} from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SettingPage from './pages/SettingPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import {useAuthStore} from './store/useAuthStore.js';
import {useThemeStore} from './store/useThemeStore.js';
import {useEffect} from 'react';
import {Navigate} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import { Loader } from "lucide-react";

const App = () => {
  const {authUser,checkAuth,isCheckingAuth} = useAuthStore();
  const {theme} = useThemeStore();
  useEffect(()=>{
    checkAuth();
  },[checkAuth]) /* on its own this never changes */
  console.log({authUser})

    if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path="/" element={authUser ? <HomePage/>: <Navigate to="/signup"/>}/>
        <Route path="/signup" element={!authUser ?<SignUpPage/>: <Navigate to="/"/>}/>
        <Route path="/login" element ={!authUser ?<LoginPage/>: <Navigate to="/"/>}/>
        <Route path="/settings" element={<SettingPage/>}/>
        <Route path="/profile" element={authUser ?<ProfilePage/>: <Navigate to="/login"/>}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
