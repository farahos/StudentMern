// import Bill from "../model/Bill.js";

// export const getBills = async (req, res) => {
//   try {
//     const bills = await Bill.find()
//       .populate("student", "studentName studentClass")
//       .sort({ createdAt: -1 }); // newest bill first

//     const seen = new Set();
//     const uniqueBills = [];

//     for (const bill of bills) {
//       if (!bill.student) continue; // ignore null students
//       if (!seen.has(bill.student._id.toString())) {
//         seen.add(bill.student._id.toString());
//         uniqueBills.push(bill);
//       }
//     }

//     res.status(200).json(uniqueBills);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // Mark as Paid (temporary)
// export const markAsPaid = async (req, res) => {
//   try {
//     const bill = await Bill.findById(req.params.id);
//     if (!bill) return res.status(404).json({ message: "Bill not found" });

//     bill.status = "Paid";
//     bill.lastPaidAt = new Date();
//     await bill.save();

//     res.status(200).json({ message: "Bill marked as Paid (temporary)", bill });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
import Bill from "../model/Bill.js";

// ✅ Get all bills (skip bills without student)
export const getBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("student", "studentName studentClass fee")
      .sort({ createdAt: -1 }); // newest first

    const filteredBills = bills.filter(bill => bill.student); // skip null students

    res.status(200).json(filteredBills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ message: error.message });
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
