import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [existingAttendanceId, setExistingAttendanceId] = useState(null); // track if attendance exists

  // Fetch all classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/classes");
        setClasses(res.data);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);

  // Fetch students + existing attendance when class/date changes
  useEffect(() => {
    if (selectedClass && date) {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Fetch students
          const res = await axios.get(
            `http://localhost:5000/api/students/class/${selectedClass}`
          );
          setStudents(res.data);

          // Fetch attendance for class & date
          const attRes = await axios.get(
            `http://localhost:5000/api/attendance/${selectedClass}/${date}`
          );

          if (attRes.data && attRes.data._id) {
            // Attendance exists → load it
            const attMap = {};
            attRes.data.records.forEach((r) => {
              attMap[r.student] = r.status;
            });
            setAttendance(attMap);
            setExistingAttendanceId(attRes.data._id);
          } else {
            // No attendance yet
            const attMap = {};
            res.data.forEach((student) => {
              attMap[student._id] = "Present";
            });
            setAttendance(attMap);
            setExistingAttendanceId(null);
          }
        } catch (err) {
          console.error("Error fetching data:", err);
          toast.error("Failed to fetch attendance data.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedClass, date]);

  const handleMark = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status) => {
    const newAttendance = {};
    students.forEach((s) => {
      newAttendance[s._id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSubmit = async () => {
    const records = students.map((s) => ({
      student: s._id,
      status: attendance[s._id] || "Present",
    }));

    try {
      if (existingAttendanceId) {
        // Update existing attendance
        await axios.put(
          `http://localhost:5000/api/attendance/${existingAttendanceId}`,
          { classId: selectedClass, date, records }
        );
        toast.success("Attendance updated successfully ✅");
      } else {
        // Create new attendance
        await axios.post("http://localhost:5000/api/attendance", {
          classId: selectedClass,
          date,
          records,
        });
        toast.success("Attendance saved successfully ✅");
      }
    } catch (err) {
      console.error("Error saving attendance:", err);
      toast.error("Failed to save attendance ❌");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Attendance</h2>

      {/* Controls */}
      <div className="flex gap-4 mb-4">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        students.length > 0 && (
          <>
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => handleMarkAll("Present")}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Mark All Present
              </button>
              <button
                onClick={() => handleMarkAll("Absent")}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Mark All Absent
              </button>
            </div>

            {/* Students Table */}
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className="border">
                    <td className="p-2 border">{s.studentName}</td>
                    <td className="p-2 border">
                      <select
                        value={attendance[s._id] || "Present"}
                        onChange={(e) => handleMark(s._id, e.target.value)}
                        className="p-1 border rounded"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={handleSubmit}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
            >
              {existingAttendanceId ? "Update Attendance" : "Save Attendance"}
            </button>
          </>
        )
      )}
    </div>
  );
};

export default Attendance;
