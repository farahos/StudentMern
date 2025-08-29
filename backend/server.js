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



const app = express();
const PORT = 8000
app.use(cors({
  origin: 'https://schoolsys-k5d8.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));


app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/student', studentRouter);
app.use('/api/attendance', attendanceRouter);
// app.use("/api/bills", billRoutes);




conectBD();
app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`);

})
