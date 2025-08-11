import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  studentName: { type: String, required: true},
  
  studentPhone: { type: String , required: true},
  course: { type: String, required: true},
  motherName: { type: String, required: true},
  motherPhone: { type: String, required: true},
  // StudentClass: { type: String, required: true},

  fee: { type: Number, required: true},
  dateRegistration: { type: Date, default: Date.now }
});

const student = mongoose.model("Student", studentSchema);
export default student;