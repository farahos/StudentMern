import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AttendanceHistory = () => {
  const [records, setRecords] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [filterType, setFilterType] = useState("day");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all classes
    const fetchClasses = async () => {
      try {
        const response = await axios.get("https://studentmern.onrender.com/api/student/studentClass");
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Failed to load classes");
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://studentmern.onrender.com/api/attendance/history/${selectedClass}`
        );
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
        toast.error("Failed to load attendance history");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [selectedClass]);

  // Date Filters
  const isToday = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isThisWeek = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);
    return date >= firstDay && date <= lastDay;
  };

  const isThisMonth = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const filteredRecords = records.filter((rec) => {
    if (filterType === "day") return isToday(rec.date);
    if (filterType === "week") return isThisWeek(rec.date);
    if (filterType === "month") return isThisMonth(rec.date);
    return true;
  });

  // Stats
  const totalPresent = filteredRecords.filter((rec) => rec.status === "present").length;
  const totalAbsent = filteredRecords.filter((rec) => rec.status === "absent").length;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-2xl">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">📊 Attendance History</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          <label className="block text-sm font-semibold text-gray-700 mb-1">Filter by Date</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-100 text-green-700 p-4 rounded-xl shadow text-center font-bold">
          ✅ Present: {totalPresent}
        </div>
        <div className="bg-red-100 text-red-700 p-4 rounded-xl shadow text-center font-bold">
          ❌ Absent: {totalAbsent}
        </div>
        <div className="bg-blue-100 text-blue-700 p-4 rounded-xl shadow text-center font-bold">
          📌 Total: {filteredRecords.length}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">⏳ Loading attendance history...</div>
      ) : selectedClass ? (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left border-b">#</th>
                <th className="p-3 text-left border-b">Student</th>
                <th className="p-3 text-left border-b">Class</th>
                <th className="p-3 text-left border-b">Date</th>
                <th className="p-3 text-left border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, index) => (
                  <tr key={rec._id} className="hover:bg-gray-50 transition">
                    <td className="p-3 border-b">{index + 1}</td>
                    <td className="p-3 border-b">{rec.studentName}</td>
                    <td className="p-3 border-b">{rec.className}</td>
                    <td className="p-3 border-b">
                      {new Date(rec.date).toLocaleDateString()}
                    </td>
                    <td
                      className={`p-3 border-b font-semibold ${
                        rec.status === "present"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {rec.status.toUpperCase()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          📌 Please select a class to view attendance history
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;
