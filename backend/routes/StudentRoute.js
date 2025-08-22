import express from 'express';
import { addStudent, countCourse, countFee, countStudents, deleteStudent, getAllStudentClass, getStudents, getStudentsByClass, updateStudent } from '../controller/StudentController.js';


const studentRouter = express.Router();
studentRouter.post('/addStudent', addStudent);
studentRouter.get('/getStudents', getStudents);
studentRouter.put('/updateStudent/:id', updateStudent);
studentRouter.delete('/deleteStudent/:id', deleteStudent);
studentRouter.get('/countStudents', countStudents);
studentRouter.get('/countFee', countFee);
studentRouter.get('/countCourse', countCourse);  // Add the new route
studentRouter.get("/studentClass", getAllStudentClass);
studentRouter.get("/class/:studentClass", getStudentsByClass);



export default studentRouter;