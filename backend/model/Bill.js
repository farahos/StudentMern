const billSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },

    status: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
     month: { type: String }, // YYYY-MM
    lastPaidAt: { type: Date },
  },
  { timestamps: true } // <-- ku dar
);
