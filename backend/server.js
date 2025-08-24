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
import student from './model/Student.js';



const app = express();
const PORT = 8000
app.use(cors({
  origin: 'https://schoolsys-k5d8.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
// 📌 Cron Job: 10 daqiiqo kasta hubi bills Paid > 10 daqiiqo → Unpaid
nodeCron.schedule("*/10 * * * *", async () => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago
  try {
    const bills = await Bill.find({ status: "Paid", lastPaidAt: { $lte: tenMinutesAgo } });
    for (let bill of bills) {
      bill.status = "Unpaid";
      await bill.save();
      console.log(`🔄 Bill ${bill._id} reverted back to Unpaid after 10 minutes`);
    }
  } catch (error) {
    console.error("Error in cron job:", error);
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
