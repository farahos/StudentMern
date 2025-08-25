import Bill from "../model/Bill.js";

// Get Bills
export const getBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("student", "studentName studentClass fee")
      .sort({ createdAt: -1 });

    const seen = new Set();
    const uniqueBills = [];

    for (const bill of bills) {
      if (!bill.student) continue;
      if (!seen.has(bill.student._id.toString())) {
        seen.add(bill.student._id.toString());
        uniqueBills.push(bill);
      }
    }

    res.status(200).json(uniqueBills);
  } catch (error) {
    console.error(error);
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
