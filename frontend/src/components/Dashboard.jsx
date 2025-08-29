import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28"];

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: [],
    totalStudents: 0,
    totalFee: 0,
    courseCounts: [],
    totalBills: 0,
    paidAmount: 0,
    unpaidAmount: 0
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [studentsRes, countRes, feeRes, coursesRes, billsRes] = await Promise.all([
          axios.get("https://studentmern.onrender.com/api/student/getStudents"),
          axios.get("https://studentmern.onrender.com/api/student/countStudents"),
          axios.get("https://studentmern.onrender.com/api/student/countFee"),
          axios.get("https://studentmern.onrender.com/api/student/countCourse"),
          axios.get("https://studentmern.onrender.com/api/bills")
        ]);

        // Bills calculations
        const totalBills = billsRes.data.reduce((acc, b) => acc + (b.amount || 0), 0);
        const paidAmount = billsRes.data
          .filter(b => b.status === "Paid")
          .reduce((acc, b) => acc + (b.amount || 0), 0);
        const unpaidAmount = billsRes.data
          .filter(b => b.status === "Unpaid")
          .reduce((acc, b) => acc + (b.amount || 0), 0);

        setStats({
          students: studentsRes.data,
          totalStudents: countRes.data.count,
          totalFee: feeRes.data.totalFee,
          courseCounts: coursesRes.data,
          totalBills,
          paidAmount,
          unpaidAmount
        });

      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Error fetching dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Last 5 students
  const recentStudents = [...stats.students]
    .sort((a, b) => new Date(b.dateRegistration) - new Date(a.dateRegistration))
    .slice(0, 5);

  // Chart data for Paid vs Unpaid
  const billStatusData = [
    { name: "Paid", value: stats.paidAmount },
    { name: "Unpaid", value: stats.unpaidAmount }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-blue-500 text-white rounded-lg p-4 shadow-md">
              <p className="text-lg">Total Students</p>
              <h2 className="text-3xl font-bold">{stats.totalStudents}</h2>
            </div>
            <div className="bg-green-500 text-white rounded-lg p-4 shadow-md">
              <p className="text-lg">Total Courses</p>
              <h2 className="text-3xl font-bold">{stats.courseCounts.length}</h2>
            </div>
            <div className="bg-yellow-400 text-white rounded-lg p-4 shadow-md">
              <p className="text-lg">Total Fees</p>
              <h2 className="text-2xl font-bold">${Number(stats.totalFee || 0).toLocaleString()}</h2>
            </div>
            <div className="bg-pink-500 text-white rounded-lg p-4 shadow-md">
              <p className="text-lg">Total Bills</p>
              <h2 className="text-2xl font-bold">${Number(stats.totalBills || 0).toLocaleString()}</h2>
            </div>
          </div>

          {/* Charts & Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Pie Chart: Course Distribution */}
            <div className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Course Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stats.courseCounts}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    nameKey="course"
                    label
                  >
                    {stats.courseCounts.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart: Paid vs Unpaid */}
            <div className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Bills Status (Paid vs Unpaid)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={billStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                    label
                  >
                    {billStatusData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Students Table */}
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Recent Registrations</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Course</th>
                    <th className="py-2 px-4 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map((student) => (
                    <tr key={student._id || student.studentName} className="border-b">
                      <td className="py-2 px-4">{student.studentName}</td>
                      <td className="py-2 px-4">{student.course}</td>
                      <td className="py-2 px-4">
                        {new Date(student.dateRegistration).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
