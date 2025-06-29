import doctorModel from "../models/doctorModel.js"
import userModel from '../models/userModel.js';
import { sendEmail, appointmentCancelledByDoctor , appointmentCompleted } from '../config/sendEmail.js';

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"

const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for doctor Login
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })
        if (!doctor) {
            return res.json({ success: false, message: 'Invalid Credintials' })
        }
        const isMatch = await bcrypt.compare(password, doctor.password)
        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: 'Invalid credentials' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {
        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to mark appointment completed for doctor panel
// const appointmentComplete = async (req, res) => {
//     try {
//         const { docId, appointmentId } = req.body
//         const appointmentData = await appointmentModel.findById(appointmentId)
//         if (appointmentData && appointmentData.docId === docId) {
//             await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
//             return res.json({ success: true, message: 'Appointment Completed' })
//         } else {
//             return res.json({ success: false, message: 'Mark Failed' })
//         }
//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: 'Appointment not found' });
    }

    if (appointmentData.docId.toString() !== docId.toString()) {
      return res.json({ success: false, message: 'Unauthorized doctor' });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });

    // Send follow-up email to user
    const user = await userModel.findById(appointmentData.userId);
    const doctor = await doctorModel.findById(docId);
    const { slotDate, slotTime } = appointmentData;

    if (user?.email) {
      await sendEmail(
        user.email,
        'Thank You for Your Appointment 🙏',
        appointmentCompleted(user, doctor, slotDate, slotTime)
      );
    }

    res.json({ success: true, message: 'Appointment marked as completed & user notified' });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



// API to cancel appointment  for doctor panel
// const appointmentCancel = async (req, res) => {
//     try {
//         const { docId, appointmentId } = req.body
//         const appointmentData = await appointmentModel.findById(appointmentId)
//         if (appointmentData && appointmentData.docId === docId) {
//             await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
//             return res.json({ success: true, message: 'Appointment cancelled' })
//         } else {
//             return res.json({ success: false, message: 'Cancellation Failed' })
//         }
//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }
const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        if (appointmentData.docId.toString() !== docId.toString()) {
            return res.json({ success: false, message: 'Unauthorized doctor' });
        }

        // Mark appointment as cancelled
        await appointmentModel.findByIdAndUpdate(appointmentId, {
            cancelled: true
        });

        // Release the time slot
        const { slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        let slots_booked = doctorData.slots_booked;
        if (slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
            await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        }

        // Notify the user
        const user = await userModel.findById(appointmentData.userId);
        if (user?.email) {
            await sendEmail(
                user.email,
                'Appointment Cancelled by Doctor',
                appointmentCancelledByDoctor(user, doctorData, slotDate, slotTime)
            );
        }

        res.json({ success: true, message: 'Appointment cancelled by doctor' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// api to get doctor dashbord for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0
        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []
        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }
        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for Doctor Panel
const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')
        res.json({ success: true, profileData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// API to update doctor profile data from Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fees, address, available } = req.body
        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })
        res.json({ success: true, message: 'Profile Updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


export { changeAvailablity, doctorList, loginDoctor, appointmentsDoctor, appointmentCancel, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile }