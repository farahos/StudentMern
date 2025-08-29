import Bill from '../model/Bill.js';
import student from '../model/Student.js';

export const addStudent = async (req, res) => {
    // add a new student
    try {
        const { studentName, studentPhone, course, motherName, motherPhone, studentClass,fee } = req.body;

        const newStudent = new student({
            studentName,
            studentPhone,
            course,
            motherName,
            motherPhone,
            studentClass,
            fee
        });

        await newStudent.save();
         
        res.status(201).send({ message: "Student added successfully" });
        
    } catch (error) {
        console.error("Error in adding student:", error);
        res.status(400).send({message: "Error in adding student"});

    }

}
export const getStudents = async (req, res) => {
    // get all students
    try {
        const students = await student.find();
        res.status(200).send(students);
        
    } catch (error) {
        console.error("Error in fetching students:", error);
        res.status(400).send({message: "Error in fetching students"});

    }
}
    export const updateStudent = async (req, res) => {
    // update a student
    try {
        const { id } = req.params;
        const { studentName, studentPhone, course, motherName, motherPhone, studentClass ,fee } = req.body;

        const updatedStudent = await student.findByIdAndUpdate(id, {
            studentName,
            studentPhone,
            course,
            motherName,
            motherPhone,
            studentClass,
            fee
        }, { new: true });

        if (!updatedStudent) {
            return res.status(404).send({ message: "Student not found" });
        }

        res.status(200).send({ message: "Student updated successfully", updatedStudent });
        
    } catch (error) {
        console.error("Error in updating student:", error);
        res.status(400).send({message: "Error in updating student"});
        
    }
    }
        // delete Student
    
    export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedStudent = await student.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).send({ message: "Student not found" });
        }

        res.status(200).send({ message: "Student deleted successfully" });
        
    } catch (error) {
        console.error("Error in deleting student:", error);
        res.status(400).send({message: "Error in deleting student"});
        
    }
    
}
export const countStudents = async (req, res) => {
    // count all students
    try {
        const count = await student.countDocuments();
        res.status(200).send({ count });
        
    } catch (error) {
        console.error("Error in counting students:", error);
        res.status(400).send({message: "Error in counting students"});
    }
}

export const countFee = async (req, res) => {
    // calculate total fee from all students
    try {
        const students = await student.find();
        const totalFee = students.reduce((sum, student) => sum + student.fee, 0);
        res.status(200).send({ totalFee });
        
    } catch (error) {
        console.error("Error in calculating total fee:", error);
        res.status(400).send({message: "Error in calculating total fee"});
    }
}
// Add this new function to your StudentController.js
export const countCourse = async (req, res) => {
    try {
        const courseCounts = await student.aggregate([
            {
                $group: {
                    _id: "$course",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    course: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);
        
        res.status(200).send(courseCounts);
        
    } catch (error) {
        console.error("Error in counting courses:", error);
        res.status(400).send({message: "Error in counting courses"});
    }
}
// Get all unique student classes
export const getAllStudentClass = async (req, res) => {
    try {
        const classes = await student.distinct("studentClass"); // returns unique values
        res.status(200).send(classes);
    } catch (error) {
        console.error("Error in fetching student classes:", error);
        res.status(400).send({ message: "Error in fetching student classes" });
    }
};
// Get all students by class
export const getStudentsByClass = async (req, res) => {
    try {
        const { studentClass } = req.params; // ama req.query haddii aad rabto ?studentClass=Class 1

        const studentsInClass = await student.find({ studentClass });

        if (studentsInClass.length === 0) {
            return res.status(404).send({ message: "No students found in this class" });
        }

        res.status(200).send(studentsInClass);

    } catch (error) {
        console.error("Error in fetching students by class:", error);
        res.status(400).send({ message: "Error in fetching students by class" });
    }
};

// biils 
export const getStudentsWithBillStatus = async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const studentsList = await student.find();

    const result = await Promise.all(
      studentsList.map(async (stud) => {
        const bill = await Bill.findOne({
          student: stud._id,
          month: currentMonth
        });

        return {
          _id: stud._id,
          studentName: stud.studentName,
          studentClass: stud.studentClass,
          fee: stud.fee,
          billStatus: bill ? bill.status || "Unpaid" : "No Bill",
         month: bill ? bill.month : null   // ku dar month
        };
      })
    );

    res.status(200).send(result);
  } catch (error) {
    console.error("Error in fetching students with bill status:", error);
    res.status(400).send({ message: "Error in fetching students with bill status" });
  }
};

