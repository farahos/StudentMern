import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { Link } from "react-router-dom";

const ViewStudent = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("day");
  const [loading, setLoading] = useState(false);

  // 🔥 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10; // waxad rabto 10/20/50

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://studentmern.onrender.com/api/student/getStudents");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

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

  const filteredStudents = students
    .filter((student) => {
      const matchesSearch =
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.motherPhone.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesDate = true;
      if (filterType === "day") matchesDate = isToday(student.dateRegistration);
      else if (filterType === "week") matchesDate = isThisWeek(student.dateRegistration);
      else if (filterType === "month") matchesDate = isThisMonth(student.dateRegistration);

      return matchesSearch && matchesDate;
    })
    .sort((a, b) => new Date(b.dateRegistration) - new Date(a.dateRegistration));

  // 🔥 Pagination logic
  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // ✅ Excel Export
  const handleExportExcel = () => {
    const dataToExport = filteredStudents.map(student => ({
      "Student Name": student.studentName,
      "Phone": student.studentPhone,
      "Course": student.course,
      "Mother's Name": student.motherName,
      "Mother's Phone": student.motherPhone,
      "Class": student.studentClass,
      "Fee": student.fee,
      "Registration Date": new Date(student.dateRegistration).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "Students_List.xlsx");
    toast.success("Excel file downloaded successfully!");
  };

  // ✅ Word Export
  const handleExportWord = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Students List", bold: true, size: 28 })],
            }),
            ...filteredStudents.map(student =>
              new Paragraph({
                children: [
                  new TextRun(`Name: ${student.studentName} | `),
                  new TextRun(`Phone: ${student.studentPhone} | `),
                  new TextRun(`Course: ${student.course} | `),
                  new TextRun(`Mother: ${student.motherName} | `),
                  new TextRun(`Mother Phone: ${student.motherPhone} | `),
                  new TextRun(`Class: ${student.studentClass} | `),
                  new TextRun(`Fee: $${student.fee} | `),
                  new TextRun(`Reg Date: ${new Date(student.dateRegistration).toLocaleDateString()}`),
                ],
              })
            ),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Students_List.docx");
    toast.success("Word file downloaded successfully!");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-blue-700">All Students</h2>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name, phone, or mother phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">All Time</option>
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            
            <button
              onClick={handleExportExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              disabled={filteredStudents.length === 0}
            >
              Export Excel
            </button>

            <button
              onClick={handleExportWord}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              disabled={filteredStudents.length === 0}
            >
              Export Word
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading students...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left border-b">Name</th>
                <th className="p-3 text-left border-b">Phone</th>
                <th className="p-3 text-left border-b">Course</th>
                <th className="p-3 text-left border-b">Mother's Name</th>
                <th className="p-3 text-left border-b">Mother's Phone</th>
                <th className="p-3 text-left border-b">Class</th>
                <th className="p-3 text-left border-b">Fee</th>
                <th className="p-3 text-left border-b">Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                currentStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <Link to={`/add-student`} className="text-blue-600 hover:underline">
                        {student.studentName}
                      </Link>
                    <td className="p-3 border-b">{student.studentPhone}</td>
                    <td className="p-3 border-b">{student.course}</td>
                    <td className="p-3 border-b">{student.motherName}</td>
                    <td className="p-3 border-b">{student.motherPhone}</td>
                    <td className="p-3 border-b">{student.studentClass}</td>
                    <td className="p-3 border-b">${student.fee}</td>
                    <td className="p-3 border-b">
                      {new Date(student.dateRegistration).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔥 Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewStudent;
