import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheckSquare } from "react-icons/fa";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedClass, setSelectedClass] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch all unique classes
  useEffect(() => {
    const fetchClasses = async () => {
        
      try {
        const response = await axios.get("/api/student/studentClass");
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Failed to load classes");
      }
    };
    fetchClasses();
  }, []);

  // Fetch students when class is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/student/class/${selectedClass}`);
        const sortedStudents = [...response.data].sort((a, b) =>
          a.studentName.localeCompare(b.studentName)
        );

        setStudents(sortedStudents);
        const statusObj = {};
        sortedStudents.forEach((student) => {
          statusObj[student._id] = "present";
        });
        setAttendanceStatus(statusObj);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClass]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSelectAll = (status) => {
    const updatedStatus = {};
    students.forEach((student) => {
      updatedStatus[student._id] = status;
    });
    setAttendanceStatus(updatedStatus);
  };

  const presentCount = Object.values(attendanceStatus).filter(
    (status) => status === "present"
  ).length;

  const submitAttendance = async () => {
    try {
      const attendanceRecords = students.map((student) => ({
        studentId: student._id,
        date: attendanceDate,
        status: attendanceStatus[student._id] || "present",
        course: student.course || "General",
      }));

      await axios.post("/api/attendance/mark-bulk", {
        classId: selectedClass,
        date: attendanceDate,
        attendanceRecords,
      });

      toast.success("✅ Attendance submitted successfully!");
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error("Failed to submit attendance");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-2xl">
      {/* Title */}
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center gap-3">
        <FaCheckSquare className="text-green-500 text-2xl" /> Class Attendance
      </h2>

      {/* Top Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Attendance Date</label>
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => handleSelectAll("")}
            disabled={students.length === 0}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl shadow-md hover:scale-[1.02] transition disabled:opacity-50"
          >
            ✅ Mark All 
          </button>
        </div>

        <div className="flex items-end">
          <button
            onClick={submitAttendance}
            disabled={!selectedClass || loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-md hover:scale-[1.02] transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "💾 Save Attendance"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 text-base font-semibold text-gray-700">
      Present Students: <span className="text-green-600">{presentCount}</span> /{" "}
        {students.length}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">⏳ Loading students...</div>
      ) : selectedClass ? (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left border-b">#</th>
                <th className="p-3 text-left border-b">Student Name</th>
                <th className="p-3 text-left border-b">Class</th>
                <th className="p-3 text-center border-b">Present</th>
                <th className="p-3 text-center border-b">Absent</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No students found in {selectedClass}
                  </td>
                </tr>
              ) : (
                students.map((student, index) => (
                  <tr key={student._id} className="hover:bg-gray-50 transition">
                    <td className="p-3 border-b">{index + 1}</td>
                    <td className="p-3 border-b font-medium">{student.studentName}</td>
                    <td className="p-3 border-b">{student.studentClass}</td>
                    <td className="p-3 border-b text-center">
                      <input
                        type="radio"
                        name={`attendance-${student._id}`}
                        checked={attendanceStatus[student._id] === "present"}
                        onChange={() => handleAttendanceChange(student._id, "present")}
                        className="w-5 h-5 accent-green-500 cursor-pointer transition"
                      />
                    </td>
                    <td className="p-3 border-b text-center">
                      <input
                        type="radio"
                        name={`attendance-${student._id}`}
                        checked={attendanceStatus[student._id] === "absent"}
                        onChange={() => handleAttendanceChange(student._id, "absent")}
                        className="w-5 h-5 accent-red-500 cursor-pointer transition"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">📌 Please select a class to view students</div>
      )}
    </div>
  );
};

export default Attendance;
