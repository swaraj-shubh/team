import { BrowserRouter as Routerz_Hehe, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react'
import Home from './pages/Home';
import Navbar from './components/navbar';
import './App.css'
import Auth from './pages/Auth';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import ChatbotWidget from './components/ChatbotWidget';

function App() {

  return (
    <>
      <Routerz_Hehe >

        <header className="">
          <Navbar />
        </header>
        <Routes className='mt-16'>
          <Route path='/' element={<Home />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/register' element={
            <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
              <Register />
            </div>
          } />
          <Route path='*' element={<div className='text-center text-gray-600'>404</div>} />
        </Routes>

      </Routerz_Hehe>
      <ChatbotWidget />
    </>
  )
}

export default App
