import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateReceipt = (appointment, user, doctor) => {
  return new Promise((resolve, reject) => {
    const dir = './receipts';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const fileName = `receipt_${appointment._id}.pdf`;
    const filePath = path.join(dir, fileName);
    const doc = new PDFDocument({ margin: 50 });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc
      .fontSize(22)
      .fillColor('#2E86DE')
      .text('QuickHealth', { align: 'center' });

    doc
      .fontSize(16)
      .fillColor('#000000')
      .text('Payment Receipt', { align: 'center' })
      .moveDown(2);

    // Receipt Info
    doc
      .fontSize(12)
      .text(`Receipt ID: ${appointment._id}`)
      .text(`Date: ${new Date().toLocaleDateString()}`)
      .moveDown();

    // Section: Patient Details
    doc
      .fontSize(14)
      .fillColor('#000000')
      .text('Patient Details', { underline: true })
      .moveDown(0.5)
      .fontSize(12)
      .fillColor('#444444')
      .text(`Name: ${user.name}`)
      .text(`Email: ${user.email}`)
      .moveDown();

    // Section: Doctor Details
    doc
      .fontSize(14)
      .fillColor('#000000')
      .text('Doctor Details', { underline: true })
      .moveDown(0.5)
      .fontSize(12)
      .fillColor('#444444')
      .text(`Doctor: ${doctor.name}`)
      .text(`Specialization: ${doctor.specialization || 'General'}`)
      .moveDown();

    // Section: Appointment Info
    doc
      .fontSize(14)
      .fillColor('#000000')
      .text('Appointment Info', { underline: true })
      .moveDown(0.5)
      .fontSize(12)
      .fillColor('#444444')
      .text(`Date: ${appointment.slotDate}`)
      .text(`Time: ${appointment.slotTime}`)
      .text(`Meeting Code: ${appointment.meetingCode}`)
      .moveDown();

    // Section: Payment Info
    doc
      .fontSize(14)
      .fillColor('#000000')
      .text('Payment', { underline: true })
      .moveDown(0.5)
      .fontSize(12)
      .fillColor('#444444')
      .text(`Amount Paid: INR ${appointment.amount}`)
      .moveDown(2);

    // Footer
    doc
      .fontSize(10)
      .fillColor('#888888')
      .text('Thank you for choosing QuickHealth.', { align: 'center' })
      .text('This receipt is valid as per our terms and services.', { align: 'center' });

    doc.end();

    stream.on('finish', () => {
      const size = fs.statSync(filePath).size;
      console.log(`✅ Clean PDF created: ${filePath} (${size} bytes)`);
      resolve(path.resolve(filePath));
    });

    stream.on('error', reject);
  });
};
