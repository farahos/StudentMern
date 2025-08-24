import express from 'express';
import { connect } from 'mongoose';
import conectBD from './config/db.js';
import { registerUser } from './controller/UserController.js';
import userRouter from './routes/UserRoute.js';
import studentRouter from './routes/StudentRoute.js';
import cors from 'cors';
import attendanceRouter from './routes/attendanceRouter.js';
import Bill from './model/Bill.js';
import billRoutes from './routes/billRoutes.js';
import nodeCron from 'node-cron';



const app = express();
const PORT = 8000
app.use(cors({
  origin: 'https://schoolsys-k5d8.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// 📌 Cron Job: Create new bills on 1st day of every month
nodeCron.schedule("0 0 1 * *", async () => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2025-09"
    const students = await Student.find();

    for (let stud of students) {
      // hubi haddii bill horey loo sameeyay bishaan
      const existingBill = await Bill.findOne({ student: stud._id, month: currentMonth });
      if (!existingBill) {
        const newBill = new Bill({
          student: stud._id,
          amount: stud.fee,   // isticmaal fee ardayga
          month: currentMonth,
        });
        await newBill.save();
        console.log(`✅ Bill created for ${stud.studentName} - ${currentMonth}`);
      }
    }
  } catch (error) {
    console.error("❌ Error in cron job:", error);
  }
});

app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/student', studentRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/bills', billRoutes);

conectBD();
app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`);

})
