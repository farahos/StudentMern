import Bill from "../model/Bill.js";

// Get Bills
export const getBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate("student"); // ✅ student fee waa imanaya
    const result = bills.map(bill => ({
      _id: bill._id,
      studentName: bill.student.studentName,
      studentClass: bill.student.studentClass,
      fee: bill.student.fee, // ✅ fee mar kasta student table ka imaanayo
      status: bill.status,
      lastPaidAt: bill.lastPaidAt,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark as Paid
export const markAsPaid = async (req, res) => {
  try {
    let bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    if (bill.status === "Paid") {
      return res.status(400).json({ message: "Bill already paid" });
    }

    bill.status = "Paid";
    bill.lastPaidAt = new Date();
    await bill.save();

    bill = await bill.populate("student", "studentName studentClass fee");

    res.status(200).json({ message: "Bill marked as Paid successfully", bill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
