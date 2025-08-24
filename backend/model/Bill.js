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
    type: Date, // goorta ugu dambeysay ee la "paid" dhahay
  },
});

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
