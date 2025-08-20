import express from 'express';
import { 
  markAttendance,
  markBulkAttendance,
  getStudentAttendance,
  getAttendancePercentage,
  getClassAttendance,
  getAbsentStudents
} from '../controller/AttendanceController.js';

const attendanceRouter = express.Router();

// Mark individual attendance
attendanceRouter.post('/mark', markAttendance);

// Mark attendance for entire class
attendanceRouter.post('/mark-bulk', markBulkAttendance);

// Get attendance records for specific student
attendanceRouter.get('/student/:studentId', getStudentAttendance);

// Calculate attendance percentage for student
attendanceRouter.get('/percentage/:studentId', getAttendancePercentage);

// Get class attendance summary
attendanceRouter.get('/class/:classId', getClassAttendance);
attendanceRouter.get('/absent/:classId/:date', getAbsentStudents);


export default attendanceRouter;