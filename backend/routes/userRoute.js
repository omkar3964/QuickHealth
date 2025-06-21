import express from 'express'
import { bookAppointment, cancelAppointment, getProfile, listAppointment, paymentRazorpay, registerUser,updateProfile, verifyRazorpay, sendOtp, resetPassword } from '../controllers/userController.js'
import { loginUser } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/get-profile',authUser, getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointment)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/payment-razorpay', authUser,paymentRazorpay)
userRouter.post('/verifyRazorpay', authUser,verifyRazorpay)
// Add these two routes for forgot/reset password
userRouter.post('/send-otp', sendOtp);
userRouter.post('/reset-password', resetPassword);

export default userRouter