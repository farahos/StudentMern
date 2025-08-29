import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    status: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
    month: { type: String }, // YYYY-MM
    lastPaidAt: { type: Date },
  },
  { timestamps: true } // si otomaatig ah u dar createdAt iyo updatedAt
);

const Bill = mongoose.model("Bill", billSchema);

export default Bill;
