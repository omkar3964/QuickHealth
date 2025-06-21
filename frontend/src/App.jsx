import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Appointment from './pages/Appointment';
import MyAppointments from './pages/MyAppointments';
import MyProfile from './pages/MyProfile';
import Contact from './pages/Contact';
import Navebar from './components/Navebar';
import Footer from './components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import Support from './components/Support';
import Meeting from './pages/Meeting';
import VideoComponent from './components/VideoComponent';


const App = () => {
  const location = useLocation();
  const isVideoPage = location.pathname.startsWith('/video');

  return (
    <div className={isVideoPage ? '' : 'mx-2 sm:mx-[10%]'}>
      <ToastContainer />
      {!isVideoPage && <Navebar />}
      {!isVideoPage && <Support />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/meeting' element={<Meeting />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/video/:url' element={<VideoComponent />} />
      </Routes>

      {!isVideoPage && <Footer />}
    </div>
  );

}

export default App;