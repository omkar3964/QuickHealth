import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navebar from './components/Navebar';
import { Routes, Route } from 'react-router-dom';
import Dashbord from './pages/Admin/Dashbord';
import AllAppontments from './pages/Admin/AllAppointments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorList from './pages/Admin/DoctorsList'
import Sidebar from './components/Sidebar';
import { DoctorContext } from './context/DoctorContext';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorDashbord from './pages/Doctor/DoctorDashbord';


const App = () => {

  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navebar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {  /*Admin routes */}
          <Route path='/' element={<></>} />
          <Route path='/admin-dashbord' element={<Dashbord />} />
          <Route path='/all-appointments' element={<AllAppontments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorList />} />
          {  /*doctor routes */}
          <Route path='/doctor-dashboard' element={<DoctorDashbord />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App