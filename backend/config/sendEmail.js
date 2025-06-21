import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    await transporter.sendMail({
      from: `"QuickHealth" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Email failed to ${to}:`, error.message);
  }
};

export const paymentSuccess = (user, doctor, amount, code) => `
  <html>
    <body style="font-family:sans-serif;">
      <h3>Hi ${user.name},</h3>
      <p>Your payment of ₹${amount} for your appointment with  ${doctor.name} was successful.</p>
      <p><strong>Meeting Code:</strong> ${code}</p>
      <p>Join Meeting: <a href="https://yourapp.com/meet/${code}">Click here</a></p>
      <br/>
      <p>Thanks for choosing QuickHealth!</p>
    </body>
  </html>
`;

export const appointmentBooked = (user, doctor, date, time, code) => `
  <h3>Hi ${user.name},</h3>
  <p>Your appointment with <strong> ${doctor.name}</strong> is confirmed.</p>
  <p><strong>Date:</strong> ${date}<br/><strong>Time:</strong> ${time}<br/><strong>Meeting Code:</strong> ${code}</p>
  <p>Join: <a href="https://yourapp.com/meet/${code}">Click to Join Meeting</a></p>
  <br/><p>— QuickHealth Team</p>
`;



export const appointmentCancelledByUser = (user, doctor, date, time) => `
  <h3>Hi ${user.name},</h3>
  <p>You have successfully <strong>cancelled</strong> your appointment with <strong> ${doctor.name}</strong>.</p>
  <p><strong>Date:</strong> ${date}<br/>
     <strong>Time:</strong> ${time}</p>
  <p>If this was a mistake, you can rebook from your dashboard.</p>
  <br/><p>— QuickHealth Team</p>
`;

export const appointmentCancelledByDoctor = (user, doctor, date, time) => `
  <h3>Hi ${user.name},</h3>
  <p>We regret to inform you that <strong> ${doctor.name}</strong> has cancelled your appointment.</p>
  <p><strong>Date:</strong> ${date}<br/>
     <strong>Time:</strong> ${time}</p>
  <p>You can rebook another slot from your dashboard.</p>
  <br/><p>We apologize for the inconvenience.<br/>— QuickHealth Team</p>
`;

export const appointmentCompleted = (user, doctor, date, time) => `
  <h3>Hi ${user.name},</h3>
  <p>Your appointment with <strong> ${doctor.name}</strong> on <strong>${date}</strong> at <strong>${time}</strong> has been successfully completed.</p>
  <p>We hope your consultation went well.</p>
  <p>We'd love to hear your feedback about the service!</p>
  <p><a href="https://yourapp.com/feedback/${doctor._id}" style="background:#4CAF50;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Leave Feedback</a></p>
  <br/>
  <p>Thanks for using QuickHealth 🙏</p>
`;

export const doctorRegistered = (doctor, plainPassword) => `
  <h3>Welcome Dr. ${doctor.name},</h3>
  <p>Congratulations! You have been successfully registered as a <strong>${doctor.speciality}</strong> on <strong>QuickHealth</strong>.</p>
  <p>Here are your login details:</p>
  <ul>
    <li><strong>Email:</strong> ${doctor.email}</li>
    <li><strong>Temporary Password:</strong> ${plainPassword}</li>
  </ul>
  <p>You can log in and update your profile or change your password anytime.</p>
  <p><a href="https://yourapp.com/doctor/login" style="background:#007bff;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Login as Doctor</a></p>
  <br/>
  <p>Thanks & welcome aboard!<br/>— QuickHealth Team</p>
`;

export const passwordResetOtp = (user, otp) => `
  <h3>Hello ${user.name || 'User'},</h3>
  <p>You have requested to reset your password on <strong>QuickHealth</strong>.</p>
  <p>Please use the following OTP to reset your password:</p>
  <h2 style="letter-spacing: 2px;">${otp}</h2>
  <p>This OTP is valid for 10 minutes.</p>
  <br/>
  <p>If you didn’t request this, please ignore this email.</p>
  <p>— QuickHealth Team</p>
`;
export const passwordResetSuccess = (user) => `
  <h3>Hi ${user.name},</h3>
  <p>Your password has been successfully reset on <strong>QuickHealth</strong>.</p>
  <p>If this wasn't you, please contact our support immediately.</p>
  <br/>
  <p>Stay safe,<br/>— QuickHealth Team</p>
`;

export const requestApproved = (doctor) => `
  <h3>Hi Dr. ${doctor.name},</h3>
  <p>We are pleased to inform you that your request to join <strong>QuickHealth</strong> has been <span style="color:green;"><strong>approved</strong></span>.</p>
  <p>Our team has reviewed your application and verified your credentials.</p>
  <p>You can now log in to your doctor dashboard and start managing appointments and consultations.</p>
  <p><a href="https://yourapp.com/doctor/login" style="background:#007bff;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Login to Dashboard</a></p>
  <br/>
  <p>Thank you for joining QuickHealth!<br/>— Team QuickHealth</p>
`;

export const requestRejected = (doctor) => `
  <h3>Hi Dr. ${doctor.name},</h3>
  <p>Thank you for your interest in joining <strong>QuickHealth</strong>.</p>
  <p>After carefully reviewing your request, we regret to inform you that your application has been <span style="color:red;"><strong>rejected</strong></span> at this time.</p>
  <p>You are welcome to reapply in the future with updated credentials or more information.</p>
  <br/>
  <p>We appreciate your time and effort.<br/>— Team QuickHealth</p>
`;

export const requestReceived = (doctor) => `
  <h3>Hi Dr. ${doctor.name},</h3>
  <p>Thank you for submitting your request to join <strong>QuickHealth</strong> as a <strong>${doctor.specialization}</strong>.</p>
  <p>Your request has been <strong>received</strong> and is currently marked as <span style="color:orange;"><strong>pending</strong></span>.</p>
  <p>Our team will carefully review your application and verify your credentials. You will be notified via email once your request is either <strong>approved</strong> or <strong>rejected</strong>.</p>
  <br/>
  <p>We appreciate your interest and will get back to you as soon as possible.</p>
  <p>— Team QuickHealth</p>
`;


export const userRegistered = (user) => `
  <h3>Welcome ${user.name},</h3>
  <p>Thank you for registering with <strong>QuickHealth</strong>! Your account has been successfully created.</p>
  <p>QuickHealth allows you to:</p>
  <ul>
    <li>Book appointments with trusted doctors</li>
    <li>Join video consultations securely</li>
    <li>Access your prescriptions and health history</li>
    <li>Get timely reminders and medical updates</li>
  </ul>
  <p>You can now log in and explore all our features designed to make your healthcare experience smooth and accessible.</p>
  <p><a href="https://yourapp.com/login" style="background:#1e90ff;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Login to QuickHealth</a></p>
  <br/>
  <p>We’re excited to have you on board!<br/>— QuickHealth Team</p>
`;

