import Attendance from '../model/Attendance.js';
import Student from '../model/Student.js';

// Mark attendance for a student
export const markAttendance = async (req, res) => {
    try {
        const { studentId, date, status, course, remarks } = req.body;

        // Check if student exists
        const studentExists = await Student.findById(studentId);
        if (!studentExists) {
            return res.status(404).send({ message: "Student not found" });
        }

        // Check if attendance already marked for this date
        const existingAttendance = await Attendance.findOne({ 
            studentId, 
            date: new Date(date) 
        });

        if (existingAttendance) {
            return res.status(400).send({ message: "Attendance already marked for this date" });
        }

        const newAttendance = new Attendance({
            studentId,
            date: new Date(date),
            status,
            course,
            remarks
        });

        await newAttendance.save();
        res.status(201).send({ message: "Attendance marked successfully" });

    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).send({ message: "Error marking attendance" });
    }
}

// Bulk attendance marking for a class
export const markBulkAttendance = async (req, res) => {
    try {
        const { classId, date, attendanceRecords } = req.body;

        // Validate all students exist
        const studentIds = attendanceRecords.map(record => record.studentId);
        const students = await Student.find({ _id: { $in: studentIds }, studentClass: classId });
        
        if (students.length !== attendanceRecords.length) {
            return res.status(400).send({ message: "Some students not found in this class" });
        }

        // Prepare attendance records
        const attendanceDocs = attendanceRecords.map(record => ({
            studentId: record.studentId,
            date: new Date(date),
            status: record.status,
            course: record.course || 'General',
            remarks: record.remarks || ''
        }));

        // Insert all at once
        await Attendance.insertMany(attendanceDocs);
        
        res.status(201).send({ 
            message: `Attendance marked for ${attendanceRecords.length} students` 
        });

    } catch (error) {
        console.error("Error in bulk attendance:", error);
        res.status(500).send({ message: "Error in bulk attendance" });
    }
}

// Get attendance for a student
export const getStudentAttendance = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { startDate, endDate } = req.query;

        const query = { studentId };
        
        if (startDate && endDate) {
            query.date = { 
                $gte: new Date(startDate), 
                $lte: new Date(endDate) 
            };
        }

        const attendance = await Attendance.find(query)
            .sort({ date: -1 })
            .populate('studentId', 'studentName studentClass');

        res.status(200).send(attendance);

    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).send({ message: "Error fetching attendance" });
    }
}

// Calculate attendance percentage
export const getAttendancePercentage = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { startDate, endDate } = req.query;

        const matchQuery = { studentId };
        
        if (startDate && endDate) {
            matchQuery.date = { 
                $gte: new Date(startDate), 
                $lte: new Date(endDate) 
            };
        }

        const result = await Attendance.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    totalDays: { $sum: 1 },
                    presentDays: { 
                        $sum: { 
                            $cond: [{ $eq: ["$status", "present"] }, 1, 0] 
                        } 
                    },
                    excusedDays: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "excused"] }, 1, 0]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalDays: 1,
                    presentDays: 1,
                    excusedDays: 1,
                    percentage: {
                        $multiply: [
                            { 
                                $divide: [
                                    "$presentDays",
                                    { $subtract: ["$totalDays", "$excusedDays"] }
                                ]
                            },
                            100
                        ]
                    }
                }
            }
        ]);

        if (result.length === 0) {
            return res.status(200).send({ 
                message: "No attendance records found",
                percentage: 0,
                totalDays: 0,
                presentDays: 0
            });
        }

        res.status(200).send(result[0]);

    } catch (error) {
        console.error("Error calculating attendance:", error);
        res.status(500).send({ message: "Error calculating attendance" });
    }
}

// Get class attendance summary
export const getClassAttendance = async (req, res) => {
    try {
        const { classId } = req.params;
        const { date } = req.query;

        const attendanceDate = date ? new Date(date) : new Date();

        // Get all students in class
        const students = await Student.find({ studentClass: classId });

        // Get attendance for these students on specified date
        const attendance = await Attendance.find({
            studentId: { $in: students.map(s => s._id) },
            date: {
                $gte: new Date(attendanceDate.setHours(0, 0, 0, 0)),
                $lte: new Date(attendanceDate.setHours(23, 59, 59, 999))
            }
        }).populate('studentId', 'studentName');

        res.status(200).send({
            date: attendanceDate,
            totalStudents: students.length,
            attendanceRecords: attendance
        });

    } catch (error) {
        console.error("Error fetching class attendance:", error);
        res.status(500).send({ message: "Error fetching class attendance" });
    }
}
 // Find absent students
export const getAbsentStudents = async (req, res) => {
    try {
        const { classId, date } = req.params;
        
        // Get all students in the class
        const students = await Student.find({ studentClass: classId });
        
        // Get attendance records for the date
        const attendance = await Attendance.find({
            date: new Date(date),
            studentId: { $in: students.map(s => s._id) }
        });
        
        // Find absent students
        const presentStudentIds = attendance
            .filter(a => a.status === 'present')
            .map(a => a.studentId.toString());
            
        const absentStudents = students.filter(
            student => !presentStudentIds.includes(student._id.toString())
        );
        
        res.status(200).send(absentStudents);
    } catch (error) {
        console.error("Error fetching absent students:", error);
        res.status(500).send({ message: "Error fetching absent students" });
    }
}
