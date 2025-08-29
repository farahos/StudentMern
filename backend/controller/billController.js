import Bill from "../model/Bill";
import student from "../model/Student";


// ✅ Generate bills for all students (run at start of each month)
export const generateMonthlyBills = async () => {
  try {
    const students = await student.find();
    const now = new Date();
    const month = now.getMonth() + 1; // 1 - 12
    const year = now.getFullYear();

    for (const student of students) {
      // Check if bill already exists for this student in current month
      const existingBill = await Bill.findOne({ student: student._id, month, year });
      if (!existingBill) {
        await Bill.create({
          student: student._id,
          amount: student.fee,
          month,
          year,
          status: "unpaid"
        });
      }
    }
    console.log("✅ Monthly bills generated");
  } catch (err) {
    console.error("❌ Error generating bills:", err);
  }
};
// 🔹 Get all students with their bills
export const getAllStudentsWithBills = async (req, res) => {
  try {
    const students = await Student.find();

    // For each student, fetch their bills
    const data = await Promise.all(
      students.map(async (student) => {
        const bills = await Bill.find({ student: student._id });
        return {
          student,
          bills,
        };
      })
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};