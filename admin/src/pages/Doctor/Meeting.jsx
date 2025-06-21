import React, { useState } from 'react'
// import { Button, IconButton, TextField } from '@mui/material';
import { assets } from '../../assets/assets.js';
import { useNavigate } from 'react-router-dom';

const Meeting = () => {

    const [meetingCode, setMeetingCode] = useState("")
    let navigate = useNavigate();


    let handleJoinVideoCall = async () => {
        // await addToUserHistory(meetingCode)
        navigate(`/video/${meetingCode}`)
    }

    return (
        <div className="m-1 flex flex-col md:flex-row justify-between items-center bg-gray-50 p-6 rounded-lg shadow-md gap-6">
            <div className="flex-1 space-y-4">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800"> Providing Quality Video Call Just Like Quality Education </h2>

                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        onChange={e => setMeetingCode(e.target.value)}
                        type="text"
                        placeholder="Enter Meeting Code"
                        className="px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        onClick={handleJoinVideoCall}
                        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-all"
                    >
                        Join
                    </button>
                </div>
            </div>

            <div className="flex-1 flex justify-center">
                <img
                    src={assets.logo3}
                    alt="logo3"
                    className="max-w-full h-auto object-contain"
                />
            </div>
        </div>

    )
}

export default Meeting