import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const Request = () => {
    const { aToken, requestData, getAllRequests, handleStatusUpdate } = useContext(AdminContext)

    useEffect(() => {
        if (aToken) {
            getAllRequests()
        }
    }, [aToken])

   

    return (
        <div className='w-full max-w-6xl m-5'>
            <p className='mb-3 text-lg font-medium'>All Requests</p>

            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>

                {/* Header row (hidden on mobile) */}
                <div className='hidden sm:grid grid-cols-[0.5fr_2fr_2fr_1.5fr_1.5fr_0.5fr] grid-flow-col py-3 px-6 border-b bg-gray-50 font-medium text-gray-700'>
                    <p>#</p>
                    <p>Doctor</p>
                    <p>Email</p>
                    <p>Phone</p>
                    <p>Date</p>
                    <p>Actions</p>
                </div>

                {/* Data rows */}
                {requestData.map((item, index) => (
                    <div
                        key={index}
                        className='flex flex-col sm:grid sm:grid-cols-[0.5fr_2fr_2fr_1.5fr_1.5fr_0.5fr] items-start sm:items-center gap-1 sm:gap-0 text-gray-500 py-4 px-6 border-b hover:bg-gray-50'
                    >
                        {/* Show index only on sm+ */}
                        <p className='hidden sm:block'>{index + 1}</p>
                        <p><span className="sm:hidden font-medium">Doctor: </span>{item.name}</p>
                        <p><span className="sm:hidden font-medium">Email: </span>{item.email}</p>
                        <p><span className="sm:hidden font-medium">Phone: </span>{item.phone}</p>
                        <p><span className="sm:hidden font-medium">Date: </span>{item.createdAt.slice(0, 10)}</p>
                        {
                            item.status === "pending"
                                ? <div className='flex '>
                                    <img className='w-10 cursor-pointer' src={assets.cancel_icon} alt="Reject" onClick={() => handleStatusUpdate(item._id, 'rejected')} />
                                    <img className='w-10 cursor-pointer' src={assets.tick_icon} alt="Approve" onClick={() => handleStatusUpdate(item._id, 'approved')} />
                                </div>
                                : <div>
                                    {item.status == "approved"
                                        ? <p className='text-green-500 text-xs font-medium'>Accepted</p>
                                        : <p className='text-red-400 text-xs font-medium'>Rejected</p>
                                    }
                                </div>
                        }

                    </div>
                ))}

            </div>
        </div>

    )
}

export default Request