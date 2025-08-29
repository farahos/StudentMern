import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const AddStudent = () => {
  const courses = ["English", "Arabic", "Math", "Science", "History"];

  const [student, setStudent] = useState({
    studentName: "",
    studentPhone: "",
    course: courses[0],
    motherName: "",
    motherPhone: "",
    studentClass: "",
    fee: "",
    dateRegistration: new Date().toISOString().split("T")[0],
  });

  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://studentmern.onrender.com/api/student/getStudents"
      );
      setStudents(res.data);
    } catch (error) {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `https://studentmern.onrender.com/api/student/updateStudent/${editId}`,
          student
        );
        toast.success("Student updated successfully!");
      } else {
        await axios.post(
          "https://studentmern.onrender.com/api/student/addStudent",
          student
        );
        toast.success("Student added successfully!");
      }
      setStudent({
        studentName: "",
        studentPhone: "",
        course: courses[0],
        motherName: "",
        motherPhone: "",
        studentClass: "",
        fee: "",
        dateRegistration: new Date().toISOString().split("T")[0],
      });
      setEditId(null);
      fetchStudents();
    } catch (error) {
      toast.error("Failed to save student");
    }
  };

  const handleEdit = (s) => {
    setStudent({
      studentName: s.studentName,
      studentPhone: s.studentPhone,
      course: s.course,
      motherName: s.motherName,
      motherPhone: s.motherPhone,
      studentClass: s.studentClass,
      fee: s.fee,
      dateRegistration: s.dateRegistration.split("T")[0],
    });
    setEditId(s._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this student?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await axios.delete(
                `https://studentmern.onrender.com/api/student/deleteStudent/${id}`
              );
              toast.success("Student deleted successfully!");
              fetchStudents();
            } catch (error) {
              toast.error("Failed to delete student");
            }
          },
        },
        { label: "No" },
      ],
    });
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleImport = async () => {
    if (!file) return toast.error("Please select a file first");
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        "https://studentmern.onrender.com/api/student/import",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Students imported successfully!");
      fetchStudents();
      setFile(null);
    } catch (error) {
      toast.error("Failed to import students");
    }
  };

  const filteredStudents = students
    .filter((s) =>
      s.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort(
      (a, b) => new Date(b.dateRegistration) - new Date(a.dateRegistration)
    );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 md:p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- Left: Form --- */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
            {editId ? "✏️ Update Student" : "➕ Add New Student"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "studentName", placeholder: "Student Name" },
              { name: "studentPhone", placeholder: "Student Phone" },
              { name: "motherName", placeholder: "Mother's Name" },
              { name: "motherPhone", placeholder: "Mother's Phone" },
              { name: "studentClass", placeholder: "Class" },
            ].map((f) => (
              <input
                key={f.name}
                name={f.name}
                value={student[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            ))}

            <select
              name="course"
              value={student.course}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
            >
              {courses.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <input
              type="number"
              name="fee"
              value={student.fee}
              onChange={handleChange}
              placeholder="Fee"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />

            <input
              type="date"
              name="dateRegistration"
              value={student.dateRegistration}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />

            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold transition hover:scale-105 ${
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
                    studentClass: "",
                    fee: "",
                    dateRegistration: new Date().toISOString().split("T")[0],
                  });
                }}
                className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold hover:bg-gray-500"
              >
                Cancel Edit
              </button>
            )}
          </form>

          {/* Import */}
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              📂 Bulk Import (Excel)
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="flex-1 border rounded px-2 py-1"
              />
              <button
                onClick={handleImport}
                disabled={!file}
                className={`px-4 py-2 rounded-lg ${
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

        {/* --- Right: List --- */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
            <h3 className="text-xl font-bold text-gray-700">📋 Students</h3>
            <input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-500">No students found.</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-blue-500 mt-2 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredStudents.map((s) => (
                <div
                  key={s._id}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border-l-4 border-blue-500"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg font-bold text-blue-700">
                        {s.studentName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {s.course} | Fee: ${s.fee}
                      </p>
                      <p className="text-xs text-gray-500">
                        Mother: {s.motherName} ({s.motherPhone})
                      </p>
                      <p className="text-xs text-gray-400">
                        Registered:{" "}
                        {new Date(s.dateRegistration).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(s)}
                        className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
