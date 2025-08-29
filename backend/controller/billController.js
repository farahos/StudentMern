import Bill from "../model/Bill.js";
import student from "../model/Student.js";

export const getBills = async (req, res) => {
  try {
    const studentsList = await student.find();

    const result = await Promise.all(
      studentsList.map(async (stud) => {
        const bill = await Bill.findOne({
          student: stud._id,
        });

        return {
          _id: stud._id,
          studentName: stud.studentName,
          studentClass: stud.studentClass,
          fee: stud.fee,
          // Haddii bill jiro → bill.status, haddii kale → "Unpaid"
          billStatus: bill ? bill.status : "Unpaid",
        };
      })
    );

    res.status(200).send(result);
  } catch (error) {
    console.error("Error in fetching students with bill status:", error);
    res.status(400).send({ message: "Error in fetching students with bill status" });
  }
};

// ✅ Mark bill as Paid
export const markAsPaid = async (req, res) => {
  try {
    const { id } = req.params;

    // Hel bill-ka oo populate student info
    const bill = await Bill.findById(id).populate("student", "studentName studentClass");

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    if (!bill.student) {
      return res.status(404).json({ message: "Associated student not found" });
    }

    if (bill.status === "Paid") {
      return res.status(400).json({ message: "Bill is already Paid" });
    }

    // Update status & lastPaidAt
    bill.status = "Paid";
    bill.lastPaidAt = new Date();

    await bill.save();

    res.status(200).json({
      message: "Bill marked as Paid successfully",
      bill: {
        id: bill._id,
        studentName: bill.student.studentName,
        studentClass: bill.student.studentClass,
        status: bill.status,
        lastPaidAt: bill.lastPaidAt,
        fee: bill.fee, // haddii fee aad rabto in la muujiyo
      },
    });
  } catch (error) {
    console.error("Error updating bill:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
