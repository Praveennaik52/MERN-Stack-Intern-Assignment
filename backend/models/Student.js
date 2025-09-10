import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    course: String,
    enrollmentDate: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // linked user
});

export default mongoose.model("Student", studentSchema);
