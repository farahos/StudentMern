// AttendanceHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AttendanceHistory = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [filter, setFilter] = useState("today"); // today | week | month | all
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ present: 0, absent: 0 });

  // ✅ Load classes for dropdown
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("https://studentmern.onrender.com/api/attendance/classes");
        setClasses(res.data);
      } catch (err) {
        toast.error("Failed to load classes");
      }
    };
    fetchClasses();
  }, []);

  // ✅ Fetch attendance when class or filter changes
  useEffect(() => {
    if (!selectedClass) return;

    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://studentmern.onrender.com/api/attendance/class/${selectedClass}`
        );

        let records = res.data || [];

        // Apply filter (today, week, month)
        const now = new Date();
        records = records.filter((r) => {
          const date = new Date(r.date);
          if (filter === "today") return date.toDateString() === now.toDateString();
          if (filter === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            return date >= weekAgo;
          }
          if (filter === "month") {
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          }
          return true; // all
        });

        setAttendance(records);

        // ✅ Calculate summary
        const presentCount = records.reduce(
          (sum, r) => sum + r.students.filter((s) => s.status === "present").length,
          0
        );
        const absentCount = records.reduce(
          (sum, r) => sum + r.students.filter((s) => s.status === "absent").length,
          0
        );
        setSummary({ present: presentCount, absent: absentCount });
      } catch (err) {
        toast.error("Failed to fetch attendance");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedClass, filter]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Attendance History</h2>

      {/* Select Class */}
      <div className="flex gap-4 mb-4">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">-- Select Class --</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.className}
            </option>
          ))}
        </select>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All</option>
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-100 p-4 rounded shadow">
          ✅ Present: <span className="font-bold">{summary.present}</span>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          ❌ Absent: <span className="font-bold">{summary.absent}</span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading attendance...</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Total Students</th>
              <th className="p-2 border">Present</th>
              <th className="p-2 border">Absent</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record, idx) => {
              const present = record.students.filter((s) => s.status === "present").length;
              const absent = record.students.filter((s) => s.status === "absent").length;
              return (
                <tr key={idx} className="text-center">
                  <td className="p-2 border">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="p-2 border">{record.students.length}</td>
                  <td className="p-2 border text-green-600">{present}</td>
                  <td className="p-2 border text-red-600">{absent}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceHistory;
