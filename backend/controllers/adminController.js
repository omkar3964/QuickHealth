
import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from "../models/doctorModel.js"
import DoctorRequest from '../models/DoctorRequest.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'
import { sendEmail, doctorRegistered, requestApproved, requestRejected, requestReceived } from '../config/sendEmail.js'

// API for adding doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        console.log({ name, email, password, speciality, degree, experience, about, fees, address }, imageFile);
        // not any field are undefiened 
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "missing details" })
        }
        // email in correct format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "enter email in valid format" })
        }
        // password greater than 8 digit
        if (password.length < 8) {
            return res.json({ success: false, message: "enter a strong password" })
        }
        // hashed password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image on cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url


        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }
        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        // Send registration email to doctor
        const html = doctorRegistered({ name, email, speciality }, password);
        await sendEmail(email, "Welcome to QuickHealth - Doctor Account Created", html);

        res.json({ success: true, message: "Doctor Added" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData
        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})
        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }
        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
const getRequestData = async (req, res) => {
    try {

        const requestData = await DoctorRequest.find({})
        res.json({ success: true, requestData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const sendJoinRequest = async (req, res) => {
  const { name, email, phone, specialization } = req.body;

  if (!name || !email || !phone || !specialization) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const existing = await DoctorRequest.findOne({ email });

    if (existing) {
      return res.status(400).json({ success: false, message: "Request already submitted" });
    }

    const request = new DoctorRequest({ name, email, phone, specialization, status: 'pending' });
    await request.save();

    // Send acknowledgement email
    await sendEmail(
      email,
      'QuickHealth: Your Request is Received',
      requestReceived(request)
    );

    return res.status(200).json({ success: true, message: "Join request submitted successfully" });

  } catch (err) {
    console.error("Join request error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


const updateDoctorRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedRequest = await DoctorRequest.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedRequest) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        if (status === 'approved') {
            await sendEmail(
                updatedRequest.email,
                'Your Request to Join QuickHealth is Approved',
                requestApproved(updatedRequest)
            );
        }

        if (status === 'rejected') {
            await sendEmail(
                updatedRequest.email,
                'Your Request to Join QuickHealth is Rejected',
                requestRejected(updatedRequest)
            );
        }

        res.status(200).json({ success: true, message: `Request ${status}`, updatedRequest });
    } catch (error) {
        console.error('Error updating request status:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};




export {
    addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel,
    adminDashboard, sendJoinRequest, getRequestData, updateDoctorRequestStatus
}