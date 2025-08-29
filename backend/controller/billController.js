import Bill from "../model/Bill.js";
import student from "../model/Student.js";


// Create bill for a student
export const createBill = async (req, res) => {
  try {
    const { studentId, month, year } = req.body;
    const student = await student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const existing = await Bill.findOne({ student: studentId, month, year });
    if (existing) return res.status(400).json({ message: "Bill already exists" });

    const newBill = new Bill({
      student: studentId,
      amount: student.fee,
      month,
      year
    });

    await newBill.save();
    res.status(201).json(newBill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark bill as paid
export const payBill = async (req, res) => {
  try {
    const { billId } = req.params;
    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    bill.status = "paid";
    await bill.save();
    res.json({ message: "Bill paid successfully", bill });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all bills for a student
export const getStudentBills = async (req, res) => {
  try {
    const { studentId } = req.params;
    const bills = await Bill.find({ student: studentId }).sort({ year: -1, month: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
