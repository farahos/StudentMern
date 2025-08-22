import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Unpaid", "Paid"],
    default: "Unpaid",
  },
  lastPaidAt: {
    type: Date,
  },
  month: {
    type: String, // YYYY-MM
    required: true,
  }
}, { timestamps: true });

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
