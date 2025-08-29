// import Bill from "../model/Bill.js";
import Student from "../model/Student.js";

// Get Bills
export const getBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("student", "studentName studentClass")
      .sort({ createdAt: -1 });

    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark Bill as Paid
export const markAsPaid = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    bill.status = "Paid";
    bill.lastPaidAt = new Date();
    await bill.save();

    res.status(200).json({ message: "Bill marked as Paid", bill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Students with Bill Status for current month
export const getStudentsWithBillStatus = async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const studentsList = await Student.find();

    const result = await Promise.all(
      studentsList.map(async (stud) => {
        const bill = await Bill.findOne({
          student: stud._id,
          month: currentMonth
        });

        return {
          _id: stud._id,
          studentName: stud.studentName,
          studentClass: stud.studentClass,
          fee: stud.fee,
          billStatus: bill ? bill.status : "Unpaid",
          month: bill ? bill.month : currentMonth
        };
      })
    );

    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ message: "Error in fetching students with bill status" });
  }
};
