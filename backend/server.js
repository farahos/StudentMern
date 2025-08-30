import express from 'express';
import { connect } from 'mongoose';
import conectBD from './config/db.js';
import { registerUser } from './controller/UserController.js';
import userRouter from './routes/UserRoute.js';
import studentRouter from './routes/StudentRoute.js';
import cors from 'cors';
import attendanceRouter from './routes/attendanceRouter.js';
import Bill from './model/Bill.js';
import billRoutes from "./routes/billRoutes.js"
import nodeCron from 'node-cron';
import student from './model/Student.js';


app.use(cors());



app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/student', studentRouter);
app.use('/api/attendance', attendanceRouter);
app.use("/api/bills", billRoutes);



// 📌 Cron Job: Bil kasta hubi bills Paid > 1 bil → Unpaid
nodeCron.schedule("0 0 1 * *", async () => {
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 maalmood ka hor
  try {
    const bills = await Bill.find({ status: "Paid", lastPaidAt: { $lte: oneMonthAgo } });
    for (let bill of bills) {
      bill.status = "Unpaid";
      await bill.save();
      console.log(`🔄 Bill ${bill._id} reverted back to Unpaid after 1 month`);
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

conectBD();
app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`);

})
