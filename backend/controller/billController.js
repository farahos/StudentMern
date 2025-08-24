
import Bill from "../model/Bill.js";
import student from "../model/Student.js";

// // ✅ Get all bills (skip bills without student)
// export const getBills = async (req, res) => {
//   try {
//     const bills = await Bill.find()
//       .populate("student", "studentName studentClass fee")
//       .sort({ createdAt: -1 }); // newest first

//     const filteredBills = bills.filter(bill => bill.student); // skip null students

//     res.status(200).json(filteredBills);
//   } catch (error) {
//     console.error("Error fetching bills:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
// biils 
export const getBills = async (req, res) => {
  try {
   
    const studentsList = await student.find();

    const result = await Promise.all(
      studentsList.map(async (stud) => {
        const bill = await Bill.findOne({
          student: stud._id
        });

        return {
          _id: stud._id,
          studentName: stud.studentName,
          studentClass: stud.studentClass,
          fee: stud.fee,
          billStatus: bill ? bill.status || "Unpaid" : "No Bill"
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

    const bill = await Bill.findById(id).populate("student", "studentName studentClass");
    if (!bill || !bill.student) {
      return res.status(404).json({ message: "Bill not found or student missing" });
    }

    if (bill.status === "Paid") {
      return res.status(400).json({ message: "Bill is already Paid" });
    }

    bill.status = "Paid";
    bill.lastPaidAt = new Date();
    await bill.save();

    res.status(200).json({
      message: "Bill marked as Paid successfully",
      bill,
    });
  } catch (error) {
    console.error("Error updating bill:", error);
    res.status(500).json({ message: error.message });
  }
};
