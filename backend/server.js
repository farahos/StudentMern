import express from 'express';
import { connect } from 'mongoose';
import conectBD from './config/db.js';
import { registerUser } from './controller/UserController.js';
import userRouter from './routes/UserRoute.js';
import studentRouter from './routes/StudentRoute.js';
import cors from 'cors';



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
conectBD();
app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`);

})
