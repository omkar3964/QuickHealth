import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import axios from 'axios'

const Request = () => {

    const { backendUrl } = useContext(AppContext)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialization: ''
    })
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post(backendUrl+"/api/admin/request", formData);

            if (data?.success) {
                toast.success("Request sent successfully");
                setFormData({ name: '', email: '',   phone: '',  specialization: ''   });
            } else {
                toast.error(data?.message || "Something went wrong");
            }

        } catch (err) {
            console.error("Request error:", err);
            toast.error("Server error: Please try again later.");
        }

        setLoading(false);
    };


    return (
        <div className='flex items-center justify-center bg-slate-50    px-4 py-3'>
            <div className='w-full max-w-lg bg-white rounded-xl shadow-md p-8 border-t-4 border-blue-600 animate-fade-in'>
                <h2 className='text-2xl font-bold text-blue-700 mb-2 text-center'>Join QuickHealth as a Doctor</h2>
                <p className='text-gray-500 text-sm mb-6 text-center'>Submit your request and we'll get back to you soon!</p>

                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='Full Name'
                        required
                        className='border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Email Address'
                        required
                        className='border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type='text'
                        name='phone'
                        value={formData.phone}
                        onChange={(e) => {
                            const value = e.target.value
                            if (/^\d{0,10}$/.test(value)) {
                                handleChange(e)
                            }
                        }}
                        placeholder='Phone Number'
                        maxLength={10}
                        required
                        className='border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="">Select Specialization</option>
                        <option value="Cardiologist">Cardiologist</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Neurologist">Neurologist</option>
                        <option value="Pediatrician">Pediatrician</option>
                        <option value="Orthopedic">Orthopedic</option>
                        <option value="General Physician">General Physician</option>
                    </select>


                    <button
                        type='submit'
                        disabled={loading}
                        className='bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-all duration-300'
                    >
                        {loading ? 'Sending...' : 'Send Request'}
                    </button>
                    {message && <p className='text-center text-sm text-red-400 mt-2'>{message}</p>}
                </form>
            </div>
        </div>
    )
}

export default Request
