# 🏥 QuickHealth

QuickHealth is a full-stack doctor appointment and online consultation platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows patients to register, browse doctors, book appointments, pay online, and even consult via secure video calls.

## 🌟 Features:

- 🧑‍⚕️ Doctor and patient login/signup
- 🔍 Search doctors by specialization/location
- 📅 Book and manage appointments
- 📞 Secure video call consultations (WebRTC + Socket.IO)
- 💳 Razorpay payment integration
- 📧 Email notifications for bookings and cancellations
- 🧾 PDF receipt generation
- 🔐 JWT-based authentication and role-based access
- 🎨 Clean and responsive UI (React + Tailwind CSS)

## 📹 Video Calling

QuickHealth includes a built-in video calling system for remote doctor-patient consultations using:

- **WebRTC** for peer-to-peer video streaming
- **Socket.IO** for signaling and real-time chat
- **Screen sharing**, audio/video toggle, and real-time chat support

## 🔗 Live Demo

- **Frontend**: [https://quickhealth-frontend.onrender.com](#)
- **Backend**: [https://quickhealth-backend.onrender.com](#)

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Axios, Socket.IO client
- **Backend**: Node.js, Express.js, MongoDB, Socket.IO
- **Real-time Video**: WebRTC + Socket.IO
- **Database**: MongoDB Atlas
- **Payments**: Razorpay
- **Email**: Nodemailer
- **PDF**: pdfkit
- **Hosting**: Render

## 🚀 Getting Started

### Backend

```bash
cd backend
npm install
npm start
