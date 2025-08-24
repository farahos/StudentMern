import cron from "node-cron";
import student from "../model/Student.js";
import Bill from "../model/Bill.js";

import "./controller/BillAutomation.js";

// Jadwal: 1-da bil kasta 12:00 AM
cron.schedule("* * * * *", async () => {

  try {
    console.log("🔄 Running monthly bill generation job...");

    const students = await student.find();
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    for (const stud of students) {
      // Check haddii bill horey loo sameeyay bishaas
      const existingBill = await Bill.findOne({
        student: stud._id,
        month: currentMonth,
      });
      if (!existingBill) {
        await Bill.create({
          student: stud._id,
          month: currentMonth,
          amount: stud.fee,
          status: "Unpaid",
        });

        console.log(`✅ Bill created for ${stud.studentName} (${currentMonth})`);
      } else {
        console.log(`⚠️ Bill already exists for ${stud.studentName} (${currentMonth})`);
      }
    }

    console.log("🎉 Monthly bills generation completed!");
  } catch (error) {
    console.error("❌ Error in bill generation cron job:", error);
  }
});
