import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { confirmAlert } from 'react-confirm-alert'; // For delete confirmation
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import confirmation dialog styles

const AddStudent = () => {
  // Available courses for dropdown
  const courses = [
    "English",
    "Arabic",
    "Math",
    "Science",
    "History",
    
  ];

  const [student, setStudent] = useState({
    studentName: "",
    studentPhone: "",
    course: courses[0], // Default to first course
    motherName: "",
    motherPhone: "",
    fee: "",
    dateRegistration: new Date().toISOString().split('T')[0] // Default to today
  });
  
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/student/getStudents");
      setStudents(res.data);
    } catch (error) {
      toast.error("Failed to fetch students");
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/student/updateStudent/${editId}`, student);
        toast.success("Student updated successfully!");
      } else {
        await axios.post("/api/student/addStudent", student);
        toast.success("Student added successfully!");
      }
      
      // Reset form and refresh list
      setStudent({
        studentName: "",
        studentPhone: "",
        course: courses[0],
        motherName: "",
        motherPhone: "",
        fee: "",
        dateRegistration: new Date().toISOString().split('T')[0]
      });
      setEditId(null);
      fetchStudents();
    } catch (error) {
      toast.error("Failed to save student");
      console.error("Error saving student:", error);
    }
  };

  const handleEdit = (student) => {
    setStudent({
      studentName: student.studentName,
      studentPhone: student.studentPhone,
      course: student.course,
      motherName: student.motherName,
      motherPhone: student.motherPhone,
      fee: student.fee,
      dateRegistration: student.dateRegistration.split('T')[0]
    });
    setEditId(student._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this student?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await axios.delete(`/api/student/deleteStudent/${id}`);
              toast.success("Student deleted successfully!");
              fetchStudents();
            } catch (error) {
              toast.error("Failed to delete student");
              console.error("Error deleting student:", error);
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/api/student/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Students imported successfully!");
      fetchStudents();
      setFile(null);
    } catch (error) {
      toast.error("Failed to import students");
      console.error("Import error:", error);
    }
  };

  const filteredStudents = students
    .filter(s =>
      s.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.dateRegistration) - new Date(a.dateRegistration));

  return (
    <div className="w-full px-4 py-6 md:p-8 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            {editId ? "Update Student" : "Add New Student"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="studentName"
              placeholder="Student Name"
              value={student.studentName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <input
              type="text"
              name="studentPhone"
              placeholder="Student Phone"
              value={student.studentPhone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            
            {/* Course Dropdown */}
            <select
              name="course"
              value={student.course}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            >
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
            
            <input
              type="text"
              name="motherName"
              placeholder="Mother's Name"
              value={student.motherName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <input
              type="text"
              name="motherPhone"
              placeholder="Mother's Phone"
              value={student.motherPhone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                name="fee"
                placeholder="Fee"
                value={student.fee}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 pl-8 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            <input
              type="date"
              name="dateRegistration"
              value={student.dateRegistration}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                editId 
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {editId ? "Update Student" : "Add Student"}
            </button>
            
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setStudent({
                    studentName: "",
                    studentPhone: "",
                    course: courses[0],
                    motherName: "",
                    motherPhone: "",
                    fee: "",
                    dateRegistration: new Date().toISOString().split('T')[0]
                  });
                }}
                className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
              >
                Cancel Edit
              </button>
            )}
          </form>

          {/* Import Section */}
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-gray-700">Bulk Import (Excel)</h3>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
              <button
                onClick={handleImport}
                disabled={!file}
                className={`px-4 py-2 rounded transition duration-300 ${
                  file 
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Import
              </button>
            </div>
          </div>
        </div>

        {/* Student List Section */}
        <div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
            <h3 className="text-xl font-semibold text-gray-700">Students List</h3>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading students...</p>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                  <p className="text-gray-500">No students found</p>
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="mt-2 text-blue-500 hover:text-blue-700"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                filteredStudents.map((s) => (
                  <div
                    key={s._id}
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300 border-l-4 border-blue-500"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-lg font-semibold text-blue-700">{s.studentName}</p>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {s.course}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Fee:</span> ${s.fee} | 
                          <span className="font-medium ml-2">Registered:</span> {new Date(s.dateRegistration).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">Student Phone:</span> {s.studentPhone}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          <span className="font-medium">Mother:</span> {s.motherName} ({s.motherPhone})
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 ml-2">
                        <button
                          onClick={() => handleEdit(s)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm transition duration-200 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition duration-200 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStudent;