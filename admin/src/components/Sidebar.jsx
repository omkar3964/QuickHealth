import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import {NavLink} from 'react-router-dom'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'

const Sidebar = () => {

  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)
  return (
    <div className='min-h-screen bg-white border-r'>
      {
        aToken  && <ul className='text-[#515151] mt-5'>
          <NavLink className={({isActive}) =>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-primary':''} `} to={'/admin-dashbord'}>
            <img src={assets.home_icon} alt="" />
            <p className='hidden md:block'>Dashbord</p>
          </NavLink>
          <NavLink className={({isActive}) =>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-primary':''} `} to={'/all-appointments'}>
            <img src={assets.appointment_icon} alt="" />
            <p className='hidden md:block' >Appointments</p>
          </NavLink>
          <NavLink className={({isActive}) =>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-primary':''} `} to={'/add-doctor'}>
            <img src={assets.add_icon} alt="" />
            <p className='hidden md:block' >Add Doctor</p>
          </NavLink>
          <NavLink className={({isActive}) =>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-primary':''} `} to={'/doctor-list'}>
            <img src={assets.people_icon} alt="" />
            <p className='hidden md:block' >Doctor List</p>
          </NavLink>
          <NavLink className={({isActive}) =>`flex  items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-primary':''} `} to={'/doctor-request'}>
            <img src={assets.request} alt="" className='size-6 ' />
            <p className='hidden md:block' >Join-Requests</p>
          </NavLink>
        </ul>
      }
      {
        dToken  && <ul className='text-[#515151] mt-5'>
          <NavLink className={({isActive}) =>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-primary':''} `} to={'/doctor-dashboard'}>
            <img src={assets.home_icon} alt="" />
            <p className='hidden md:block' >Dashbord</p>
          </NavLink>
          <NavLink className={({isActive}) =>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-primary':''} `} to={'/doctor-appointments'}>
            <img src={assets.appointment_icon} alt="" />
            <p className='hidden md:block' >Appointments</p>
          </NavLink>
          <NavLink className={({isActive}) =>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-primary':''} `} to={'/doctor-meeting'}>
            <img src={assets.logo4} className="w-6 h-7 " alt="" />
            <p className='hidden md:block' >Go Live</p>
          </NavLink>
          <NavLink className={({isActive}) =>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-primary':''} `} to={'/doctor-profile'}>
            <img src={assets.people_icon} alt="" />
            <p className='hidden md:block' >Profile</p>
          </NavLink>
        </ul>
      }
      
    </div>
  )
}

export default Sidebar

// (
//             <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_1fr_1fr_0.5fr_2fr_1fr_1fr_1fr] gap-1 items-center text-gray-500  py-3 px-6 border-b hover:bg-gray-50 ' key={index}>
//               <p className='max-sm:hidden'>{index + 1}</p>
//               <div className='flex items-center gap-2'>
//                 <img className='w-8 rounded-full' src={item.userData.image} alt="" />
//                 <p>{item.userData.name}</p>
//               </div>
//               <div>
//                 <p className='text-xs inline border border-primary px-2 rounded-full'>
//                   {item.payment ? 'Online' : 'CASH'}
//                 </p>
//               </div>
//               <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
//               <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
//               <p 
//                 onClick={() => navigate(`/video/${item.meetingCode}`)} >{item.meetingCode}</p>
//               <p>{currency}{item.amount}</p>
//               {
//                 item.cancelled
//                   ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
//                   : item.isCompleted
//                     ? <p className='text-green-500 text-xs font-medium'>Completed</p>
//                     : <div className='flex'>
//                       <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
//                       <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
//                     </div>
//               }

//             </div>
//           ))