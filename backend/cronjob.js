import cron from "node-cron";
import student from "./model/Student";
import Bill from "./model/Bill";


cron.schedule("0 0 1 * *", async () => {
  console.log("📌 Running monthly bill job...");

  const students = await student.find();
  const now = new Date();
  const month = now.getMonth() + 1; // 0-based
  const year = now.getFullYear();

  for (const student of students) {
    const existing = await Bill.findOne({ student: student._id, month, year });
    if (!existing) {
      const newBill = new Bill({
        student: student._id,
        amount: student.fee,
        month,
        year,
        status: "unpaid"
      });
      await newBill.save();
      console.log(`✅ Bill created for ${student.studentName}`);
    }
  }
});
