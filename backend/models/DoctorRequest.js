import mongoose from "mongoose";

const doctorRequestSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, },
        email: { type: String, required: true, unique: true, },
        phone: { type: String, required: true, },
        specialization: { type: String, required: true, },
        status: {type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending',},
    },
    { timestamps: true, }
);

const DoctorRequest = mongoose.models.DoctorRequest ||mongoose.model("DoctorRequest", doctorRequestSchema);

export default DoctorRequest;
